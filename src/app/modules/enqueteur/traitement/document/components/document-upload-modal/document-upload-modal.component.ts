import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-document-upload-modal',
  templateUrl: './document-upload-modal.component.html',
  styleUrls: ['./document-upload-modal.component.css']
})
export class DocumentUploadModalComponent {
  @Input() isOpen = false
  @Output() close = new EventEmitter<void>()
  @Output() upload = new EventEmitter<{ files: File[]; investigation: string; documentType: string }>()

  selectedInvestigation = "unclassified"
  selectedDocumentType = "other"
  selectedFiles: File[] = []

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel()
    }
  }

  onCancel(): void {
    this.selectedFiles = []
    this.close.emit()
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files) {
      this.selectedFiles = Array.from(input.files)
    }
  }

  removeFile(file: File): void {
    this.selectedFiles = this.selectedFiles.filter((f) => f !== file)
  }

  onUpload(): void {
    if (this.selectedFiles.length > 0) {
      this.upload.emit({
        files: this.selectedFiles,
        investigation: this.selectedInvestigation,
        documentType: this.selectedDocumentType,
      })
      this.selectedFiles = []
      this.close.emit()
    }
  }
}
