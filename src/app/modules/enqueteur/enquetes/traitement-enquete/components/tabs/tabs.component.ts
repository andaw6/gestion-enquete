import { Component, signal, Input, inject, OnInit, Renderer2, computed } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { DocumentsTabComponent } from '@modules/enqueteur/enquetes/traitement-enquete/components/documents-tab/documents-tab.component';
import { GeneralInfoTabComponent } from '@modules/enqueteur/enquetes/traitement-enquete/components/general-info-tab/general-info-tab.component';
import { ObservationsTabComponent } from '@modules/enqueteur/enquetes/traitement-enquete/components/observations-tab/observations-tab.component';
import { SourcesTabComponent } from '@modules/enqueteur/enquetes/traitement-enquete/components/sources-tab/sources-tab.component';
import { TestimoniesTabComponent } from '@modules/enqueteur/enquetes/traitement-enquete/components/testimonies-tab/testimonies-tab.component';
import { EnqueteModel } from "@core/model/enquete.model";
import { DocumentPreviewModalComponent } from "@shared/components/document-preview-modal/document-preview-modal.component";
import { DeleteErrorPopupComponent, PopupConfig } from "@shared/components/delete-error-popup/delete-error-popup.component";
import { DocumentModel } from '@core/model/document.model';
import { AutreInfoModel, AutreInfoRequestData } from '@core/model/autre-info.model';
import { TemoignageModalComponent } from '@modules/enqueteur/enquetes/traitement-enquete/components/temoignage-modal/temoignage-modal.component';
import { Logger } from '@core/services/logger.service';
import { EnqueteStateService } from '@store/enquete/enquete-state.service';
import { DeleteModalComponent, DeleteModelInfo } from '@shared/components/delete-modal/delete-modal.component';
import { ToastService } from '@core/services/toast.service';
import { AutreInfoService } from '@modules/enqueteur/enquetes/autre-info.service';
import { DocumentService } from '@modules/enqueteur/traitement/document/document.service';
import { UtilService } from '@core/services/util.service';
import { TAB_TRAITEMENT_ENQUETE } from "@config/constant/index";

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf, NgIf,
    DocumentsTabComponent,
    GeneralInfoTabComponent,
    ObservationsTabComponent,
    SourcesTabComponent,
    TestimoniesTabComponent,
    DocumentPreviewModalComponent,
    TemoignageModalComponent,
    DeleteModalComponent,
    DeleteErrorPopupComponent,
  ],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  activeTab = signal<string>("informations")
  enquete!: EnqueteModel;
  isPreviewModalOpen: boolean = false;
  selectedDocument: DocumentModel | null = null;
  deletedTemoignage?: AutreInfoModel;
  deletedDocument?: DocumentModel;
  openNouveauTemoignageModal: boolean = false;
  openDeleteModal: boolean = false;


  private readonly enqueteState = inject(EnqueteStateService);
  private readonly documentService = inject(DocumentService);
  private readonly autreInfoService = inject(AutreInfoService)
  private readonly toasService = inject(ToastService);
  private readonly utilService = inject(UtilService);
  private readonly renderer = inject(Renderer2);

  testimony?: AutreInfoModel;
  popupConfig: PopupConfig = { isVisible: false, details: '', showArchiveButton: false };
  infoDeleteModal1: DeleteModelInfo = {
    title: 'Supprimer le témoignage',
    subtitle: 'Cette action est irréversible',
    message: 'Souhaitez-vous supprimer ce témoignage ? Toutes les données associées seront perdues définitivement.'
  }
  deletedAction = signal<"temoignage" | "document">("temoignage");

  infoDeleteModal = computed<DeleteModelInfo>(() => {
    const info: DeleteModelInfo = {
      title: 'Supprimer le témoignage',
      subtitle: 'Cette action est irréversible',
      message: 'Souhaitez-vous supprimer ce témoignage ? Toutes les données associées seront perdues définitivement.'
    };
    if (this.deletedAction() == "document") {
      info.title = "Supprimer le document"
      info.message = "Souhaitez-vous supprimer ce document ? Toutes les données associées seront perdues définitivement."
    }
    return info;
  });


  ngOnInit(): void {
    this.enqueteState.enquete$.subscribe(enquete => {
      if (enquete) {
        this.enquete = enquete;
      }
    })
  }

  onViewDocument(doc: DocumentModel) {
    this.selectedDocument = doc;
    this.isPreviewModalOpen = true;
  }

  onDownloadDocument(doc: DocumentModel) {
    this.documentService.getView(doc.id, { download: true }).subscribe({
      next: (blob: Blob) => this.utilService.downloadBlob(this.renderer, blob, `${doc.nom}.${doc.extension}`),
      error: () => this.utilService.showNotification('Erreur lors du téléchargement du document', 'error')
    });
  }



  onEditTemoignage(event: AutreInfoModel) {
    Logger.log({ message: "Editer un témoignage", data: event }, "TabsComponent")
    this.testimony = event;
    this.openNouveauTemoignageModal = true;
  }

  onDeleteTemoignage(event: AutreInfoModel) {
    Logger.log({ message: "Supprimer un témoignage", data: event }, "TabsComponent");
    this.openDeleteModal = true;
    this.deletedTemoignage = event;
    this.deletedAction.set("temoignage");
  }

  remove() {
    switch (this.deletedAction()) {
      case "document":
        this.removeDocument();
        break;
      case "temoignage":
        this.removeTemoignage();
        break;
    }
  }

  removeDocument() {
    if (!!this.deletedDocument) {
      this.documentService.deleteOne(this.deletedDocument!.id, { enqueteId: this.enquete.id }).subscribe({
        next: _ => {
          this.toasService.show("Document supprimé avec succès ✅");
          this.deletedDocument = undefined;
          this.openDeleteModal = false;
        },
        error: err => {
          this.toasService.show(err.message ?? "Erreur lors de la suppression du document", "error");
          this.openDeleteModal = false;
        }
      })
    }
  }

  removeTemoignage() {
    if (!!this.deletedTemoignage) {
      this.autreInfoService.deleteOne(this.deletedTemoignage!.id).subscribe({
        next: _ => {
          this.enqueteState.deleteAutreInfo(this.deletedTemoignage!.id);
          this.toasService.show("Témoignage supprimé avec succès ✅");
          this.deletedTemoignage = undefined;
          this.openDeleteModal = false;
        },
        error: _ => {
          this.toasService.show("Erreur lors de la suppression du témoignage", "error");
          this.openDeleteModal = false;
        }
      })
    }
  }

  tabs = TAB_TRAITEMENT_ENQUETE;

  switchTab(tabId: string) {
    this.activeTab.set(tabId)
    const tab = this.tabs.find((t) => t.id === tabId)
    // this.notificationService.show("Onglet changé", `Basculé vers ${tab?.label}`, "info")
  }

  getTabClasses(tabId: string): string {
    const isActive = this.activeTab() === tabId
    return isActive
      ? "text-primary-600 border-b-2 border-primary-600 "
      : "text-gray-500 hover:text-gray-700 "
  }

  nouveauTemoignage(event: { action: "create" | "update", data: AutreInfoModel }) {
    Logger.log({ message: "Savegarder témoignage", data: event }, "TabsComponent")
    if (event.action == "create") {
      this.enqueteState.addAutreInfo(event.data);
    } else {
      this.enqueteState.updateAutreInfo(event.data);
    }
    console.log(this.enquete, "nouveau témoignage");

    if (this.enquete && this.enquete.progression < 50) {
      this.enqueteState.updateProgession(this.enquete.progression + 5);
    }
  }

  onPopupClose() {
    this.popupConfig.isVisible = false;
  }

  onArchiveDocument() {
    this.onPopupClose();
  }

  onDeleteDocument(doc: DocumentModel) {
    this.deletedDocument = undefined;
    this.documentService.checkIfUsed(doc.id, { enqueteId: this.enquete.id }).subscribe({
      next: response => {
        if (!response.used) {
          this.openDeleteModal = true;
          this.deletedDocument = doc;
          this.deletedAction.set("document");
        }
        else {
          this.popupConfig.isVisible = true;
          this.popupConfig.details = response.message;
        }
      }
    })

  }

}
