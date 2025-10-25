import { Component, inject, type OnInit, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule } from "@angular/forms"
import type { EnqueteModel } from "@core/model/enquete.model"
import type { DocumentModel } from "@core/model/document.model"
import { EnqueteStateService } from "@store/enquete/enquete-state.service"
import { UtilService } from "@core/services/util.service"
import { UtilisateurStateService } from "@store/utilisateur/utilisateur-state.service"
import { combineLatest } from "rxjs"
import type { UtilisateurModel } from "@core/model/utilisateur.model"

import { DocumentsListComponent } from "./components/documents-list/documents-list.component"
import { DocumentUploadZoneComponent } from "./components/document-upload-zone/document-upload-zone.component"
import { DocumentUploadModalComponent } from "./components/document-upload-modal/document-upload-modal.component"
import { ExistingDocumentsModalComponent } from "./components/existing-documents-modal/existing-documents-modal.component"

@Component({
  selector: "app-documents-tab",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DocumentsListComponent,
    DocumentUploadZoneComponent,
    DocumentUploadModalComponent,
    ExistingDocumentsModalComponent,
  ],
  templateUrl: "./documents-tab.component.html",
  styleUrls: ["./documents-tab.component.css"],
})
export class DocumentsTabComponent implements OnInit {
  @Output() viewDocument = new EventEmitter<DocumentModel>()
  @Output() downloadDocument = new EventEmitter<DocumentModel>()
  @Output() deleteDocument = new EventEmitter<DocumentModel>()

  enquete!: EnqueteModel
  user!: UtilisateurModel
  documents: DocumentModel[] = []
  selectedFiles: File[] = []

  // États des modals
  showUploadModal = false
  showExistingDocumentsModal = false

  private readonly enqueteState = inject(EnqueteStateService)
  private readonly utilisateurState = inject(UtilisateurStateService)
  private readonly utilService = inject(UtilService)

  ngOnInit(): void {
    combineLatest([this.utilisateurState.user$, this.enqueteState.enquete$]).subscribe(([user, enquete]) => {
      if (user && enquete) {
        this.user = user
        this.enquete = enquete
        this.documents = enquete.documents ?? []
      }
    })
  }

  handleFilesFromDropZone(files: File[]): void {
    this.selectedFiles = files
    this.openUploadModal()
  }

  openUploadModal(): void {
    this.showUploadModal = true
  }

  closeUploadModal(): void {
    this.showUploadModal = false
    this.selectedFiles = []
  }

  openExistingDocumentsModal(): void {
    this.showExistingDocumentsModal = true
  }

  closeExistingDocumentsModal(): void {
    this.showExistingDocumentsModal = false
  }

  handleUploadSuccess(documents: DocumentModel[]): void {
    documents.forEach((doc) => this.enqueteState.addDocument(doc))
    this.utilService.showNotification(`${documents.length} document(s) ajouté(s) avec succès`, "success")
    this.closeUploadModal()
  }

  handleDocumentsAssociated(documents: DocumentModel[]): void {
    documents.forEach((doc) => this.enqueteState.addDocument(doc))
    this.utilService.showNotification(`${documents.length} document(s) associé(s) avec succès`, "success")
    this.closeExistingDocumentsModal()
  }
}
