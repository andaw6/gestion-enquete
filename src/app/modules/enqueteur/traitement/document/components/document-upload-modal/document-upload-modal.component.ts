import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeDocumentService } from "@modules/admin/parametrage/type-document/type-document.service";
import { ApiResponse } from "@core/interfaces/api-response.interface";
import { TypeDocument } from "@modules/admin/parametrage/type-document/type-document";
import { Observable, of } from "rxjs";
import { ResponseError } from "@core/interfaces/response-error.interface";
import { NotificationAlertService } from "@core/services/notification-alert.service";
import { DocumentUpload } from "@modules/enqueteur/traitement/document/document";
import { AsyncPipe, CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilisateurStateService } from '@store/utilisateur/utilisateur-state.service';
import { UtilisateurModel } from '@core/model/utilisateur.model';


@Component({
  selector: 'app-document-upload-modal',
  templateUrl: './document-upload-modal.component.html',
  styleUrls: ['./document-upload-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    AsyncPipe
  ]
})
export class DocumentUploadModalComponent implements OnInit {

  @Input() isOpen = false
  @Output() close = new EventEmitter<void>()
  @Output() upload = new EventEmitter<DocumentUpload>()

  selectedInvestigation = "unclassified"
  selectedDocumentType = ""
  selectedFile: File | null = null
  documentName = ""
  documentDescription = ""
  loading: boolean = false;
  typeDocument$: Observable<TypeDocument[]> = of([]);



  constructor(
    private typeDocumentService: TypeDocumentService,
    private notificationService: NotificationAlertService,
  ) {
  }




  ngOnInit() {

    this.loadTypeDocument();
  }

  loadTypeDocument(): void {
    this.loading = true;
    this.typeDocumentService.getAll().subscribe({
      next: (response: ApiResponse<TypeDocument>) => {
        this.typeDocument$ = of(response.data);
        this.loading = false;
      },
      error: (err: ResponseError) => {
        this.loading = false;
        this.notificationService.showNotification(
          err.message || 'Erreur lors du chargement des types de documents',
          'error'
        );
      }
    })
  }


  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel()
    }
  }

  onCancel(): void {
    this.selectedFile = null
    this.documentName = ""
    this.documentDescription = ""
    this.selectedInvestigation = "unclassified"
    this.selectedDocumentType = ""
    this.close.emit()
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]
      if (!this.documentName.trim()) {
        const fileName = this.selectedFile.name
        this.documentName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null
    this.documentName = ""
  }

  onUpload(): void {
    if (this.selectedFile && this.documentName.trim()) {
      this.upload.emit({
        file: this.selectedFile,
        investigation: this.selectedInvestigation,
        documentType: this.selectedDocumentType,
        documentName: this.documentName.trim(),
        documentDescription: this.documentDescription.trim()
      })
    }
  }

  reset() {
    this.selectedFile = null
    this.documentName = ""
    this.documentDescription = ""
    this.selectedInvestigation = "unclassified"
    this.selectedDocumentType = ""
  }

  canUpload(): boolean {
    return !this.selectedFile || !this.documentName.trim();
  }

}
