import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  signal,
  WritableSignal,
} from '@angular/core';
import { Observable, Subject, of, map } from 'rxjs';
import { DocumentService } from '@modules/enqueteur/traitement/document/document.service';
import {
  Document,
  DocumentData, DocumentFilterOptions,
  DocumentUpload,
} from '@modules/enqueteur/traitement/document/document';
import { TypeDocumentService } from '@modules/admin/parametrage/type-document/type-document.service';
import { Pagination } from '@core/interfaces/pagination.interface';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { ResponseError } from '@core/interfaces/response-error.interface';
import {
  DocumentUploadModalComponent
} from '@modules/enqueteur/traitement/document/components/document-upload-modal/document-upload-modal.component';
import { IParams } from "@core/interfaces/http-options.interface";
import { UtilService } from "@core/services/util.service";
import { ViewMode } from "@core/types";
import { DocumentModel } from '@core/model/document.model';
import { UtilisateurStateService } from '@store/utilisateur/utilisateur-state.service';
import { UtilisateurModel } from '@core/model/utilisateur.model';

@Component({
  selector: 'app-document-sans-enquete',
  templateUrl: './document-sans-enquete.component.html',
  styleUrls: ['./document-sans-enquete.component.css'],
})
export class DocumentSansEnqueteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  documents$: Observable<DocumentModel[]> = of([]);
  loading: WritableSignal<boolean> = signal(false);

  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalItem: 0,
    totalPage: 0,
  };

  currentFilters: DocumentFilterOptions = {
    searchTerm: '',
    filterType: 'all',
    sortBy: 'date',
    viewMode: 'grid',
  };

  isUploadModalOpen = false;
  isPreviewModalOpen = false;
  showDeleteModal = false;

  selectedDocument: DocumentModel | null = null;
  deletedDocument: DocumentModel | null = null;
  selectedItem = '';
  isDeleting = false;

  paramFilter: IParams = {};
  private readonly key: string = "DocumentSans-Enquete.viewMode";

  @ViewChild(DocumentUploadModalComponent)
  uploadModal!: DocumentUploadModalComponent;
  pageTitle: string = "Mes Documents non classés";
  pageSubTitle: string = "Retrouvez et organisez facilement vos documents d'enquêtes non classés";


  private user$ = this.utilisateurState.user$;
  user!: UtilisateurModel;

  constructor(
    private documentService: DocumentService,
    private utilService: UtilService,
    private utilisateurState: UtilisateurStateService,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    if (window != undefined) {
      this.currentFilters.viewMode = localStorage.getItem(this.key) as ViewMode ?? 'grid';
    }
    this.user$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    })
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDocuments(): void {
    this.loading.set(true);
    this.documentService.getAll({ ...this.pagination, ...this.paramFilter, utilisateurId: this.user.id }).subscribe({
      next: (response: ApiResponse<DocumentModel>) => {
        this.documents$ = of(response.data);
        this.pagination = response.pagination;
      },
      error: () => {
        this.utilService.showNotification(
          'Erreur lors du chargement des documents',
          'error'
        );
      },
      complete: () => this.loading.set(false),
    });
  }

  setPagination(pagination: Pagination): void {
    this.pagination = pagination;
    this.loadDocuments();
  }

  onFiltersChange(filters: DocumentFilterOptions): void {
    this.currentFilters = filters;
    localStorage.setItem(this.key, this.currentFilters.viewMode);
    this.applyFilters();
  }

  private applyFilters(): void {
    this.paramFilter = {};
    if (this.currentFilters.filterType !== 'all') {
      this.paramFilter["categorie"] = this.currentFilters.filterType;
    }
    if (this.currentFilters.sortBy) {
      switch (this.currentFilters.sortBy) {
        case 'date':
          this.paramFilter["sort"] = 'createdAt,desc';
          break;
        case 'name':
          this.paramFilter["sort"] = 'nom,asc';
          break;
        case 'size':
          this.paramFilter["sort"] = 'taille,asc';
          break;
        case 'type':
          this.paramFilter["sort"] = 'type.libelle,asc';
          break;
      }
    }
    if (this.currentFilters.searchTerm) {
      this.paramFilter["nom"] = this.currentFilters.searchTerm.toLowerCase();
    }
    console.log(this.paramFilter);
    this.loadDocuments();
  }

  onUploadClick(): void {
    this.isUploadModalOpen = true;
  }

  onUploadModalClose(): void {
    this.isUploadModalOpen = false;
  }

  onUpload(data: DocumentUpload): void {
    if (!data?.file) {
      this.utilService.showNotification('Aucun fichier sélectionné.', 'warning');
      return;
    }

    const payload: DocumentData = {
      nom: data.documentName?.trim() ?? 'N/A',
      description: data.documentDescription?.trim() ?? 'N/A',
      typeId: Number(data.documentType) || 0,
      file: data.file,
      utilisateurId: this.user.id
    };

    this.documentService.create(payload).subscribe({
      next: (document: DocumentModel) => {
        this.documents$ = this.documents$.pipe(
          map((docs) => [document, ...docs])
        );
        this.utilService.showNotification(
          'Document téléchargé avec succès !',
          'success'
        );
        this.uploadModal.reset();
        this.uploadModal.close.emit();
        if (!this.pagination.totalItem) {
          this.pagination.totalItem = 1;
        }
      },
      error: (err: ResponseError) => {
        this.utilService.showNotification(
          err?.message || 'Erreur lors du téléchargement du document.',
          'error'
        );
      },
    });
  }

  onPreviewClick(document: DocumentModel): void {
    this.selectedDocument = document;
    this.isPreviewModalOpen = true;
  }

  onDownloadClick(document: DocumentModel): void {
    this.documentService.getView(document.id, { download: true }).subscribe({
      next: (blob: Blob) => this.utilService.downloadBlob(this.renderer, blob, `${document.nom}.${document.extension}`),
      error: () =>
        this.utilService.showNotification(
          'Erreur lors du téléchargement du document',
          'error'
        ),
    });
  }


  onDeleteClick(document: DocumentModel): void {
    this.showDeleteModal = true;
    this.selectedItem = `${document.nom}.${document.extension}`;
    this.deletedDocument = document;
  }

  handleDelete(): void {
    if (!this.deletedDocument) {
      this.closeDeleteModal();
      return;
    }

    this.isDeleting = true;

    this.documentService.deleteOne(this.deletedDocument.id).subscribe({
      next: () => {
        this.documents$ = this.documents$.pipe(
          map((docs) => docs.filter((doc) => doc.id !== this.deletedDocument?.id))
        );
        // this.utilService.showNotification('Document supprimé avec succès !', 'success');
        this.closeDeleteModal();
      },
      error: (err) => {
        this.utilService.showNotification(
          'Erreur lors de la suppression du document !',
          'error'
        );
        this.closeDeleteModal();
      },
    });
  }

  private closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.isDeleting = false;
    this.deletedDocument = null;
  }
}
