import { Component, computed, Renderer2, signal, WritableSignal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { EnqueteModel } from '@core/model/enquete.model';
import { DocumentModel } from '@core/model/document.model';
import { StatusCardsComponent } from './components/status-cards/status-cards.component';
import { ProgressSectionComponent } from './components/progress-section/progress-section.component';
import { EnqueteDetailsComponent } from './components/enquete-details/enquete-details.component';
import { EntityLoaderComponent, LoadingError } from '@shared/components/entity-loader/entity-loader.component';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@core/services/logger.service';
import { EnqueteService } from '@modules/enqueteur/enquetes/enquete.service';
import { DocumentService } from '@modules/enqueteur/traitement/document/document.service';
import { UtilService } from '@core/services/util.service';
import { BreadcrumbComponent, BreadcrumbItem } from "@shared/components/breadcrumb/breadcrumb.component";
import { ModalDetailDemandeComponent } from "../components/modal-detail-demande/modal-detail-demande.component";

@Component({
  selector: 'app-enquete-detatil',
  standalone: true,
  imports: [
    CommonModule,
    StatusCardsComponent,
    ProgressSectionComponent,
    EnqueteDetailsComponent,
    EntityLoaderComponent,
    NgIf,
    BreadcrumbComponent,
    ModalDetailDemandeComponent
],
  templateUrl: './enquete-detatil.component.html',
  styleUrls: ['./enquete-detatil.component.css']
})
export class EnqueteDetatilComponent {
  enquete: WritableSignal<EnqueteModel | null> = signal<EnqueteModel | null>(null);
  failLoading: WritableSignal<boolean> = signal<boolean>(false);
  loading: WritableSignal<boolean> = signal<boolean>(false);
  selectedDocument: DocumentModel | null = null;
  isPreviewModalOpen: boolean = false;
  showDetailDemande:boolean = false;


  breadcrumbItems = computed<BreadcrumbItem[]>(() => [
    {
      label: 'Accueil',
      url: "/demandeur",
      icon: 'fas fa-home'
    },
    {
      label: 'Demandes en cours',
      url: "/demandeur/demandes/en-cours",
    },
    {
      label: !!this.enquete() ? `${this.enquete()?.demande?.reference}` : "Chargement...",
      action: () => {
        const demande = this.enquete()?.demande;
        if (demande) {
          Logger.info(`This is a test ${demande.id}`);
          this.router.navigate(["/demandeur/demandes/detail", demande.id]).then(_ => _);
        }

      }
    },
    {
      label: !!this.enquete() ? `${this.enquete()!.reference}` : 'Chargement...',
      active: true,
    },
  ]);

  constructor(
    private documentService: DocumentService,
    private service: EnqueteService,
    private utilService: UtilService,
    private renderer: Renderer2,
    private router: Router,
  ) {
  }



  loadData = (id: number): Promise<EnqueteModel | null> =>
    firstValueFrom(this.service.getOne(id));

  goBack = () => history.back();

  onLoaded(data: EnqueteModel | null) {
    Logger.info({ message: "Changement de donnée", data }, "DetailDemandeComponent:onDemandeLoaded");
    this.enquete.set(data);
    if (!!data) {
      this.loading.set(false);
      this.failLoading.set(false);
    }
  }

  onLoadingStateChanged(isLoading: boolean) {
    Logger.info({ message: "Changement de l'état du chargement", data: isLoading }, "DemandeEnqueteDetailsComponent:onLoadingStateChanged")
    this.loading.set(isLoading)
  }

  onLoadingError(err: LoadingError | null) {
    this.failLoading.set(!!err);
  }

  onPreview(document: DocumentModel): void {
    this.selectedDocument = document;
    this.isPreviewModalOpen = true;

  }

  onDownload(document: DocumentModel): void {
    this.documentService.getView(document.id, { download: true }).subscribe({
      next: (blob: Blob) => this.utilService.downloadBlob(this.renderer, blob, `${document.nom}.${document.extension}`),
      error: () =>
        this.utilService.showNotification(
          'Erreur lors du téléchargement du document',
          'error'
        ),
    });
  }
}
