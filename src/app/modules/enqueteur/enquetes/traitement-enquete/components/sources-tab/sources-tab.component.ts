import { Component, EventEmitter, OnInit, Output, signal, ViewChild } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { AddSourceComponent } from "./components/add-source/add-source.component";
import { SourceData, SourceInfoModel, SourceInfoRequestData } from "@core/model/source-info.model";
import { FormsModule } from "@angular/forms";
import { EnqueteStateService } from '@store/enquete/enquete-state.service';
import { ToastService } from '@core/services/toast.service';
import { EnqueteModel } from '@core/model/enquete.model';
import { SourceCardComponent } from "@modules/enqueteur/traitement/source-info/components/source-card/source-card.component";
import { SourceInfoModalComponent } from "@modules/enqueteur/traitement/source-info/components/source-info-modal/source-info-modal.component";
import { UtilisateurModel } from '@core/model/utilisateur.model';
import { UtilisateurStateService } from '@store/utilisateur/utilisateur-state.service';
import { DocumentModel } from '@core/model/document.model';
import { DocumentPreviewModalComponent } from '@shared/components/document-preview-modal/document-preview-modal.component';
import { SourceInfoService } from '@modules/enqueteur/traitement/source-info/source-info.service';
import { Logger } from '@core/services/logger.service';
import { Pagination } from '@core/interfaces/pagination.interface';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Option } from '@core/interfaces/option.interface';
import { forkJoin } from 'rxjs';
import { EtatSourceService } from '@modules/enqueteur/traitement/source-info/etat-source.service';
import { TypeSourceService } from '@modules/admin/parametrage/type-source/type-source.service';
import { EnqueteService } from '@modules/enqueteur/enquetes/enquete.service';
import { SourceUpdateFormComponent, SelectedDocument } from '@modules/enqueteur/traitement/source-info/components/source-update-form/source-update-form.component';
import { DocumentService } from '@modules/enqueteur/traitement/document/document.service';



@Component({
  selector: 'app-sources-tab',
  standalone: true,
  imports: [
    CommonModule,
    AddSourceComponent,
    FormsModule,
    SourceCardComponent,
    SourceInfoModalComponent,
    DocumentPreviewModalComponent,
    PaginationComponent,
    SourceUpdateFormComponent,
    NgForOf, NgIf,
  ],
  templateUrl: './sources-tab.component.html',
  styleUrls: ['./sources-tab.component.css']
})
export class SourcesTabComponent implements OnInit {

  openSourceModal: boolean = false;

  openSourceDetailModal: boolean = false;
  openViewDocumentModal: boolean = false;
  openUpdateSourceModal: boolean = false;
  isSubmitting = signal<boolean>(false);

  selectedSource: SourceInfoModel | null = null;
  selectedDocument: DocumentModel | null = null;

  pagination: Pagination = {
    totalItem: 1,
    totalPage: 1,
    limit: 5,
    page: 1
  };


  @Output() downloadDocument = new EventEmitter<DocumentModel>();

  sources: SourceInfoModel[] = [];
  filteredSources: SourceInfoModel[] = [];
  paginatedSources: SourceInfoModel[] = [];
  enquete!: EnqueteModel;
  user!: UtilisateurModel;

  etatOptions: Option[] = [];
  typeOptions: Option[] = [];
  documents: DocumentModel[] = [];

  filterType = '';
  filterEtat = '';
  searchTerm = '';

  @ViewChild(AddSourceComponent) addSource!: AddSourceComponent;

  constructor(
    private readonly toastService: ToastService,
    private readonly sourceService: SourceInfoService,
    private readonly enqueteState: EnqueteStateService,
    private readonly userState: UtilisateurStateService,
    private readonly etatService: EtatSourceService,
    private readonly typeService: TypeSourceService,
    private readonly enqueteService: EnqueteService,
    private readonly documentService: DocumentService,
  ) { }


  ngOnInit(): void {
    this.enqueteState.enquete$.subscribe(enquete => {
      if (enquete) {
        this.enquete = enquete;
        this.sources = this.enquete.sourcesInfos ?? []
        this.filteredSources = [...this.sources];
        this.setPage(this.pagination);
      }
    })
    this.userState.user$.subscribe(user => {
      if (user) this.user = user;
    })
    this.loadData();
  }


  loadData() {
    forkJoin({
      etats: this.etatService.getAll({ sort: "libelle,asc" }),
      types: this.typeService.getAll({ sort: "libelle,asc" }),
      documents: this.documentService.getAll({ utilisateurId: this.user.id })
    }).subscribe({
      next: ({ etats, types, documents }) => {
        this.etatOptions = etats.data.map(e => ({ value: e.code, label: e.libelle }))
        this.typeOptions = types.data.map(t => ({ value: t.code, label: t.libelle }))
        this.documents = documents.data;
      },
      error: err => {
        this.toastService.show("Erreur lors du chargement des états et types de source", "error");
      }
    })
  }

  setPage(pg: Pagination): void {
    this.pagination = pg;
    const now = new Date();

    // 1️⃣ Trier les sources par date de mise à jour (desc)
    const sorted = [...this.filteredSources].sort((a, b) => {
      const dateA = new Date(a.updatedAt ?? now).getTime();
      const dateB = new Date(b.updatedAt ?? now).getTime();
      return dateB - dateA; // plus récent en premier
    });

    // 2️⃣ Appliquer la pagination après tri
    const start = (this.pagination.page - 1) * this.pagination.limit;
    const end = start + this.pagination.limit;
    this.paginatedSources = sorted.slice(start, end);
  }


  handleSubmit(event: SourceData) {
    if (event.mode != "select") {
      const mode = event.mode;
      const data = event.data!;
      data.source.enqueteIds = [this.enquete.id];
      data.source.utilisateurId = this.user.id;
      this.isSubmitting.set(true);
      Logger.info({ message: `Donnée de ${mode == "create" ? "création" : "modification"} d'un source`, data }, "SourcesTabComponent:handleSubmit")

      const request = mode === "create" ? this.sourceService.create(data) : this.sourceService.update(data.source.id!, data);

      request.subscribe({
        next: (source) => {
          this.isSubmitting.set(false);
          this.selectedSource = null;
          if (mode == "create") {
            this.enqueteState.addSourceInfo(source);
            this.addSource.close();
          } else {
            this.enqueteState.updateSourceInfo(source);
            this.openUpdateSourceModal = false;
          }
          this.toastService.show(`La source d'information à bien été ${mode == "create" ? "créer" : "modifier"}`);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.toastService.show("Erreur lors de l'envoie des données", "error");
        }
      })
    } else {
      const source = event.source
      if (!!source) {
        this.enqueteService.associeSources(this.enquete.id, [source.id]).subscribe({
          next: (response) => {
            this.enqueteState.addSourceInfo(source);
            this.toastService.show(`La source ${source.id} à bien été ajouté à l'enquete`);
          },
          error: (err) => {
            this.toastService.show("Erreur lors de l'association de la source d'information à l'enquête", "error");
          }
        })
      }
    }

  }




  applyFilters(): void {
    this.filteredSources = this.sources.filter(source => {
      const matchType = !this.filterType || source.type.code === this.filterType;
      const matchEtat = !this.filterEtat || source.etat.code === this.filterEtat;
      const matchSearch = !this.searchTerm ||
        source.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        source.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchType && matchEtat && matchSearch;
    });
    this.setPage(this.pagination);
  }


  viewSourceDetails(source: SourceInfoModel): void {
    console.log('Afficher les détails de la source:', source);

  }

  editSource(source: SourceInfoModel): void {
    this.openUpdateSourceModal = true;
    this.selectedSource = source;
  }

  viewDetails(source: SourceInfoModel): void {
    this.openSourceDetailModal = true;
    this.selectedSource = source;
  }


  viewDetailsDocument(document: DocumentModel) {
    this.selectedDocument = document;
    this.openViewDocumentModal = true;
    this.openSourceDetailModal = false;
  }

  closeDocumentModal() {
    this.openViewDocumentModal = false;
    this.openSourceDetailModal = true;
    this.selectedDocument = null
  }
}
