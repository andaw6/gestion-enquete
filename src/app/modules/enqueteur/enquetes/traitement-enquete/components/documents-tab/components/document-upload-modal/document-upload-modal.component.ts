import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  type ElementRef,
  inject,
  type OnInit,
  type OnChanges,
  type SimpleChanges,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import type { DocumentModel, DocumentRequestData } from "@core/model/document.model"
import type { Option } from "@core/interfaces/option.interface"
import { TypeDocumentService } from "@modules/admin/parametrage/type-document/type-document.service"
import { DocumentService } from "@modules/enqueteur/traitement/document/document.service"
import { UtilService } from "@core/services/util.service"
import { APP_TYPE_DOCUMENT_AUTORISER } from "@config/constant"

@Component({
  selector: 'app-document-upload-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './document-upload-modal.component.html',
  styleUrls: ['./document-upload-modal.component.css']
})
export class DocumentUploadModalComponent implements OnInit, OnChanges {
  @ViewChild("modalFileInput") modalFileInput!: ElementRef<HTMLInputElement>

  @Input() show = false
  @Input() initialFiles: File[] = []
  @Input() enqueteId?: number
  @Output() close = new EventEmitter<void>()
  @Output() uploadSuccess = new EventEmitter<DocumentModel[]>()

  documentForm: FormGroup
  options: Option[] = []
  selectedFiles: File[] = []
  fileErrors: string[] = []
  isModalDragOver = false
  isUploading = false
  uploadError = ""

  private readonly maxFileSize = 50 * 1024 * 1024 // 10MB
  private readonly allowedTypes: Record<string, string> = APP_TYPE_DOCUMENT_AUTORISER;


  private readonly fb = inject(FormBuilder)
  private readonly typeDocumentService = inject(TypeDocumentService)
  private readonly documentService = inject(DocumentService)
  protected readonly utilService = inject(UtilService)

  constructor() {
    this.documentForm = this.fb.group({
      nom: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ["", [Validators.maxLength(500)]],
      typeId: ["", [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.loadDocumentTypes()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["initialFiles"] && this.initialFiles) {
      this.selectedFiles = [...this.initialFiles]
    }

    if (changes["show"] && !this.show) {
      this.resetForm()
    }
  }

  private loadDocumentTypes(): void {
    this.typeDocumentService.getAll().subscribe({
      next: (response) => {
        this.options = response.data.map((type) => ({
          label: type.libelle,
          value: type.code,
        }))
      },
      error: (error) => {
        console.error("Erreur lors du chargement des types de document:", error)
        this.utilService.showNotification("Erreur lors du chargement des types de document", "error")
      },
    })
  }

  onModalFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files) {
      this.handleModalFiles(Array.from(input.files))
    }
  }

  onModalDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isModalDragOver = true
  }

  onModalDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isModalDragOver = false
  }

  onModalDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isModalDragOver = false

    if (event.dataTransfer?.files) {
      this.handleModalFiles(Array.from(event.dataTransfer.files))
    }
  }

  triggerModalFileInput(): void {
    this.modalFileInput.nativeElement.click()
  }

  private handleModalFiles(files: File[]): void {
    const { validFiles, errors } = this.validateFiles(files)

    this.selectedFiles = [...this.selectedFiles, ...validFiles]
    this.fileErrors = errors

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
        const isDuplicate = this.selectedFiles.some((f) => f.name === file.name && f.size === file.size)
        if (!isDuplicate) {
          validFiles.push(file)
        } else {
          errors.push(`${file.name}: fichier déjà sélectionné`)
        }
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

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1)
    this.fileErrors = []
  }

  canSubmit(): boolean {
    return this.documentForm.valid && this.selectedFiles.length > 0 && !this.isUploading && this.options.length > 0
  }

  uploadDocuments(): void {
    if (!this.canSubmit() || !this.enqueteId) {
      this.markFormGroupTouched()
      return
    }

    this.isUploading = true
    this.uploadError = ""
    const documentData = { ...this.documentForm.value }

    const info: DocumentRequestData = {
      nom: documentData.nom,
      description: documentData.description,
      codeType: documentData.typeId,
    }

    const data: { files: File[]; infos: DocumentRequestData[] } = { files: this.selectedFiles, infos: [] }

    this.selectedFiles.forEach((_, index) => {
      data.infos.push({ ...info, nom: `${info.nom} ${index + 1}` })
    })

    this.documentService.associer({ enqueteId: this.enqueteId }, data).subscribe({
      next: (response) => {
        this.handleUploadSuccess(response)
      },
      error: (err) => {
        this.handleUploadError(err)
      },
    })
  }

  private handleUploadSuccess(documents: DocumentModel[]): void {
    this.isUploading = false
    this.uploadSuccess.emit(documents)
  }

  private handleUploadError(error: any): void {
    console.error("Erreur lors de l'upload:", error)
    this.isUploading = false
    this.uploadError = "Erreur lors du téléchargement. Veuillez réessayer."
  }

  private markFormGroupTouched(): void {
    Object.keys(this.documentForm.controls).forEach((key) => {
      this.documentForm.get(key)?.markAsTouched()
    })
  }

  getFileIconByType(mimeType: string): string {
    let extension = (APP_TYPE_DOCUMENT_AUTORISER[mimeType] ?? "n/a").toLowerCase();
    return this.utilService.getIcon(extension, false);
  }

  private resetForm(): void {
    this.documentForm.reset()
    this.selectedFiles = []
    this.fileErrors = []
    this.uploadError = ""
    this.isUploading = false
  }
}