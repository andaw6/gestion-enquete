import { Component, Output, EventEmitter, ViewChild, type ElementRef, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { UtilService } from "@core/services/util.service"
import { APP_TYPE_DOCUMENT_AUTORISER } from "@config/constant"


@Component({
  selector: 'app-document-upload-zone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-upload-zone.component.html',
  styleUrls: ['./document-upload-zone.component.css']
})
export class DocumentUploadZoneComponent {
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>
  @Output() filesSelected = new EventEmitter<File[]>()

  isDragOver = false
  private readonly maxFileSize = 50 * 1024 * 1024 // 10MB
  private readonly allowedTypes: Record<string, string> = APP_TYPE_DOCUMENT_AUTORISER;


  private readonly utilService = inject(UtilService)

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files) {
      this.handleFiles(Array.from(input.files))
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = true
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = false
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = false

    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files))
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }

  private handleFiles(files: File[]): void {
    const { validFiles, errors } = this.validateFiles(files)

    if (validFiles.length > 0) {
      this.filesSelected.emit(validFiles)
    }

    if (errors.length > 0) {
      this.utilService.showNotification("Certains fichiers ont été ignorés: " + errors.join(", "), "warning")
    }
  }

  private validateFiles(files: File[]): { validFiles: File[]; errors: string[] } {
    const validFiles: File[] = []
    const errors: string[] = []

    files.forEach((file) => {
      const validation = this.validateSingleFile(file)
      if (validation.isValid) {
        validFiles.push(file)
      } else {
        errors.push(`${file.name}: ${validation.error}`)
      }
    })

    return { validFiles, errors }
  }

  private validateSingleFile(file: File): { isValid: boolean; error?: string } {
    if (file.size > this.maxFileSize) {
      return {
        isValid: false,
        error: `taille trop importante (${this.utilService.formatFileSize(file.size)} > 10 MB)`,
      }
    }

    if (!(file.type in this.allowedTypes)) {
      return {
        isValid: false,
        error: "type de fichier non autorisé",
      }
    }

    return { isValid: true }
  }
}
