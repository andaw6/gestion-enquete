import { Component, computed, Renderer2, signal, WritableSignal } from '@angular/core';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { DemandeEnqueteModel, DemandeEtatDemande } from '@core/model/demande-enquete.model';
import { DocumentModel } from '@core/model/document.model';
import { Logger } from '@core/services/logger.service';
import { UtilService } from '@core/services/util.service';
import { formatDate } from '@core/util/function/date-formatter.util';

import { DemandeService } from '../demande.service';
import { DocumentService } from '@modules/enqueteur/traitement/document/document.service';

import { InformationsGeneralesComponent } from "../components/informations-generales/informations-generales.component";
import { PersonneConcerneeComponent } from "../components/personne-concernee/personne-concernee.component";
import { DocumentsComponent } from "../components/documents/documents.component";
import { DemandeSidebarComponent } from "../components/demande-sidebar/demande-sidebar.component";

import { EntityLoaderComponent, LoadingError } from '@shared/components/entity-loader/entity-loader.component';
import { PageHeader1Component, PageHeaderConfig } from '@shared/components/page-header-1/page-header-1.component';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/components/breadcrumb/breadcrumb.component';
import { DocumentPreviewModalComponent } from '@shared/components/document-preview-modal/document-preview-modal.component';
import { StatusBadgeComponent } from "../components/status-badge/status-badge.component";

@Component({
  selector: 'app-demande-enquete-details',
  standalone: true,
  imports: [
    CommonModule,
    InformationsGeneralesComponent,
    PersonneConcerneeComponent,
    DocumentsComponent,
    DemandeSidebarComponent,
    EntityLoaderComponent,
    PageHeader1Component,
    BreadcrumbComponent,
    DocumentPreviewModalComponent,
    NgIf,
    NgClass,
    StatusBadgeComponent
],
  templateUrl: './demande-enquete-details.component.html',
  styleUrls: ['./demande-enquete-details.component.css']
})
export class DemandeEnqueteDetailsComponent {

  // --- STATE ---
  demande: WritableSignal<DemandeEnqueteModel | null> = signal<DemandeEnqueteModel | null>(null);
  loading: WritableSignal<boolean> = signal<boolean>(false);
  failLoading: WritableSignal<boolean> = signal<boolean>(false);

  selectedDocument: DocumentModel | null = null;
  isPreviewModalOpen: boolean = false;

  // --- BREADCRUMB ---
  breadcrumbItems = computed<BreadcrumbItem[]>(() => [
    { label: 'Accueil', url: "/demandeur", icon: 'fas fa-home' },
    { label: 'Tous mes demandes', url: "/demandeur/demandes" },
    { label: this.demande() ? `${this.demande()!.reference}` : 'Chargement...', url: '', active: true },
  ]);

  // --- PAGE HEADER ---
  headerConfig = computed<PageHeaderConfig>(() => {
    Logger.info("changement headerConfig", "DemandeEnqueteDetailsComponent");
    const demande = this.demande();
    const loading = this.loading();

    const config: PageHeaderConfig = {
      title: "Détails de la Demande d'Enquête",
      subtitle: "Aucun demande n'a été trouvé",
      backButtonLeft: { cssClass: "hover:bg-primary hover:text-white", action: this.goBack },
      buttons: []
    };

    if (loading) config.subtitle = "Chargement des données....";
    else if (demande) config.subtitle = `Référence: ${demande.reference}  Créée le: ${formatDate(demande.createdAt)}`;

    return config;
  });

  // --- CONSTRUCTOR ---
  constructor(
    private service: DemandeService,
    private documentService: DocumentService,
    private utilService: UtilService,
    private renderer: Renderer2,
    private router: Router,
  ) { }

  // --- VALIDATION & ANNULATION DEMANDE ---
  private changeEtatDemande(etat: DemandeEtatDemande, successMsg: string = ""): void {
    const demande = this.demande();
    if (!demande) return;

    this.service.changeEtat(demande.id, etat).subscribe({
      next: (result: DemandeEnqueteModel) => { if (result) this.demande.set(result); },
      error: () => this.utilService.showNotification("Erreur lors de la mise à jour de la demande", "error")
    });
  }

  validate(): void {
    Logger.info("Tentative de validation de la demande");
    this.changeEtatDemande(DemandeEtatDemande.Valider);
  }

  annuler(): void {
    Logger.info("Tentative d'annulation de demande");
    this.changeEtatDemande(DemandeEtatDemande.Annuler);
  }

  // --- NAVIGATION ---
  update(): void { if (this.demande()) this.router.navigate(["/demandeur/demandes/modifier", this.demande()!.id]); }
  goBack = (): void => history.back();

  // --- UTILITAIRES DEMANDE ---
  canValidate(): boolean {
    const demande = this.demande();
    return !!demande && [DemandeEtatDemande.EnAttente, DemandeEtatDemande.EnComplement].includes(demande.etat.code as DemandeEtatDemande);
  }

  loadDemande = (id: number): Promise<DemandeEnqueteModel | null> =>
    firstValueFrom(this.service.getOne(id));

  onDemandeLoaded(data: DemandeEnqueteModel | null): void {
    Logger.info({ message: "Changement de donnée", data }, "DemandeEnqueteDetailsComponent:onDemandeLoaded");
    this.demande.set(data);

    if (data) {
      this.demande.update(d => ({ ...d!, commentaireValidation: "En attente de validation par le responsable. Vérification des documents en cours." }));
      this.loading.set(false);
      this.failLoading.set(false);
    }
  }

  onLoadingStateChanged(isLoading: boolean): void {
    Logger.info({ message: "Changement de l'état du chargement", data: isLoading }, "DemandeEnqueteDetailsComponent:onLoadingStateChanged");
    this.loading.set(isLoading);
  }

  onLoadingError(err: LoadingError | null): void { this.failLoading.set(!!err); }

  // --- DOCUMENTS ---
  onPreview(document: DocumentModel): void {
    this.selectedDocument = document;
    this.isPreviewModalOpen = true;
  }

  onDownload(document: DocumentModel): void {
    this.documentService.getView(document.id, { download: true }).subscribe({
      next: (blob: Blob) => this.utilService.downloadBlob(this.renderer, blob, `${document.nom}.${document.extension}`),
      error: () => this.utilService.showNotification('Erreur lors du téléchargement du document', 'error')
    });
  }

  // --- PRIORITÉ ---
  getPrioriteClass(priorite: number): string {
    return {
      1: "bg-green-100 text-green-800",
      2: "bg-green-100 text-green-800",
      3: "bg-yellow-100 text-yellow-800",
      4: "bg-red-100 text-red-800",
      5: "bg-red-100 text-red-800"
    }[priorite] || "bg-gray-100 text-gray-800";
  }

  getPrioriteLabel(priorite: number): string {
    const labels = ["", "Très faible (1/5)", "Faible (2/5)", "Moyenne (3/5)", "Élevée (4/5)", "Critique (5/5)"];
    return labels[priorite] || "Non définie";
  }
}
