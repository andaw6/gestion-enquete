import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EtatSourceInfo, SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";
import {delay, map, Observable, of, throwError} from "rxjs";

export interface CreateSourceFormData {
  nom: string
  type: string
  description: string
  niveauFiabilite: string
  etat: string
  dateObtention: string
  dateMiseAJour?: string
  commentaires?: string
  enqueteAssociee?: string
  ajouterAuxFavoris: boolean
}

// Interface pour les documents uploadés
export interface DocumentUpload {
  file: File
  nom: string
  type: string
}

// DTO pour la création - correspond exactement au backend
export interface SourceInfoRequestDTO {
  nom: string
  description?: string
  commentaires?: string
  niveauFiabilite: string
  etatId: number
  utilisateurId: number
  dateObtention?: string // ISO string format
  documentIds?: number[]
}


@Injectable({
  providedIn: "root",
})
export class SourceService {
  private sources: SourceInfo[] = []
  private currentUserId = 1 // ID de l'utilisateur connecté (Fatou Sall)

  // États disponibles (normalement récupérés du backend)
  private etatsDisponibles: EtatSourceInfo[] = [
    { id: 1, code: "active", libelle: "Active" },
    { id: 2, code: "verified", libelle: "Vérifiée" },
    { id: 3, code: "pending", libelle: "En attente de vérification" },
    { id: 4, code: "archived", libelle: "Archivée" },
    { id: 5, code: "unavailable", libelle: "Indisponible" },
  ]

  constructor() {}

  /**
   * Crée une nouvelle source d'information
   */
  createSource(formData: CreateSourceFormData, documents: DocumentUpload[]): Observable<SourceInfo> {
    // Validation des données
    if (!formData.nom || !formData.description || !formData.niveauFiabilite) {
      return throwError(() => new Error("Les champs obligatoires sont manquants"))
    }

    // Conversion du formulaire vers le DTO backend
    const dto: SourceInfoRequestDTO = this.mapFormDataToDTO(formData, documents)

    // Simulation de l'appel API
    return this.sendToBackend(dto).pipe(
      delay(1000), // Simulation du délai réseau
      map((response) => this.mapDTOToSourceInfo(response, formData)),
    )
  }

  /**
   * Récupère les états disponibles
   */
  getEtatsDisponibles(): Observable<EtatSourceInfo[]> {
    return of(this.etatsDisponibles)
  }

  /**
   * Récupère les enquêtes disponibles
   */
  getEnquetes(): Observable<any[]> {
    const enquetes = [
      { id: 1, nom: "SARL TechCorp - Enquête employeur" },
      { id: 2, nom: "Marie Diallo - Enquête travailleur" },
      { id: 3, nom: "Association Solidarité - Enquête bénéficiaire" },
    ]
    return of(enquetes)
  }

  /**
   * Upload des documents (simulation)
   */
  uploadDocuments(documents: DocumentUpload[]): Observable<number[]> {
    // Simulation de l'upload des documents
    const documentIds = documents.map(() => Math.floor(Math.random() * 1000) + 1)
    return of(documentIds).pipe(delay(500))
  }

  /**
   * Sauvegarde en brouillon
   */
  saveDraft(formData: CreateSourceFormData): Observable<any> {
    console.log("Sauvegarde en brouillon:", formData)
    return of({ success: true, message: "Brouillon sauvegardé" }).pipe(delay(300))
  }

  /**
   * Conversion des données du formulaire vers le DTO backend
   */
  private mapFormDataToDTO(formData: CreateSourceFormData, documents: DocumentUpload[]): SourceInfoRequestDTO {
    const etatId = this.getEtatIdByCode(formData.etat)

    return {
      nom: formData.nom.trim(),
      description: formData.description?.trim(),
      commentaires: formData.commentaires?.trim(),
      niveauFiabilite: formData.niveauFiabilite,
      etatId: etatId,
      utilisateurId: this.currentUserId,
      dateObtention: formData.dateObtention ? this.formatDateForBackend(formData.dateObtention) : undefined,
      documentIds: [], // Sera rempli après l'upload des documents
    }
  }

  /**
   * Simulation de l'envoi au backend
   */
  private sendToBackend(dto: SourceInfoRequestDTO): Observable<SourceInfo> {
    console.log("Envoi au backend:", dto)

    // Simulation d'une réponse du backend
    const mockResponse: SourceInfo = {
      id: Date.now(),
      nom: dto.nom,
      description: dto.description || "",
      commentaires: dto.commentaires || "",
      niveauFiabilite: dto.niveauFiabilite,
      etat: this.getEtatById(dto.etatId),
      utilisateur: {
        id: dto.utilisateurId,
        username: "Fatou Sall",
      },
      documents: [],
      dateObtention: dto.dateObtention || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return of(mockResponse)
  }

  /**
   * Conversion de la réponse backend vers l'objet complet
   */
  private mapDTOToSourceInfo(response: SourceInfo, originalFormData: CreateSourceFormData): SourceInfo {
    return {
      ...response,
      // Ajout d'informations supplémentaires si nécessaire
    }
  }

  /**
   * Récupère l'ID de l'état par son code
   */
  private getEtatIdByCode(code: string): number {
    const etat = this.etatsDisponibles.find((e) => e.code === code)
    return etat?.id || 1 // Par défaut "active"
  }

  /**
   * Récupère l'état par son ID
   */
  private getEtatById(id: number): any {
    const etat = this.etatsDisponibles.find((e) => e.id === id)
    return etat || this.etatsDisponibles[0]
  }

  /**
   * Formate la date pour le backend (ISO string)
   */
  private formatDateForBackend(dateString: string): string {
    const date = new Date(dateString)
    return date.toISOString()
  }

  /**
   * Validation des fichiers
   */
  validateFiles(files: File[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ]

    files.forEach((file, index) => {
      if (file.size > maxSize) {
        errors.push(`Le fichier "${file.name}" dépasse la taille maximale de 10MB`)
      }

      if (!allowedTypes.includes(file.type)) {
        errors.push(`Le type du fichier "${file.name}" n'est pas autorisé`)
      }
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}



@Component({
  selector: 'app-form-source-info',
  templateUrl: './form-source-info.component.html',
  styleUrls: ['./form-source-info.component.css']
})
export class FormSourceInfoComponent implements OnInit {
  sourceForm!: FormGroup
  selectedFiles: File[] = []
  enquetes: any[] = []
  etatsDisponibles: EtatSourceInfo[] = []
  isSubmitting = false
  showSuccessModal = false
  createdSource: any = null
  fileValidationErrors: string[] = []

  sourceTypes = [
    { value: "document_officiel", label: "Document officiel" },
    { value: "base_donnees", label: "Base de données" },
    { value: "contact_expert", label: "Contact expert" },
    { value: "temoignage", label: "Témoignage" },
    { value: "site_web", label: "Site web" },
    { value: "archive", label: "Archive" },
    { value: "media", label: "Média/Presse" },
    { value: "autre", label: "Autre" },
  ]

  reliabilityLevels = [
    { value: "5", label: "5 - Très élevée (Source officielle vérifiée)" },
    { value: "4", label: "4 - Élevée (Source reconnue et fiable)" },
    { value: "3", label: "3 - Moyenne (Source généralement fiable)" },
    { value: "2", label: "2 - Faible (Source à vérifier)" },
    { value: "1", label: "1 - Très faible (Source douteuse)" },
  ]

  constructor(
    private fb: FormBuilder,
    private sourceService: SourceService,
) {}

  ngOnInit(): void {
    this.initializeForm()
    this.loadData()
  }

  initializeForm(): void {
    const today = new Date().toISOString().split("T")[0]

    this.sourceForm = this.fb.group({
      nom: ["", [Validators.required, Validators.minLength(3)]],
      type: ["", Validators.required],
      description: ["", [Validators.required, Validators.minLength(10)]],
      niveauFiabilite: ["", Validators.required],
      etat: ["active"], // Code de l'état par défaut
      dateObtention: [today],
      dateMiseAJour: [""],
      commentaires: [""],
      enqueteAssociee: [""],
      ajouterAuxFavoris: [false],
    })
  }

  loadData(): void {
    // Charger les enquêtes
    this.sourceService.getEnquetes().subscribe((enquetes) => {
      this.enquetes = enquetes
    })

    // Charger les états disponibles
    this.sourceService.getEtatsDisponibles().subscribe((etats) => {
      this.etatsDisponibles = etats
    })
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[]
    this.addFiles(files)
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()

    const files = Array.from(event.dataTransfer?.files || []) as File[]
    this.addFiles(files)
  }

private addFiles(files: File[]): void {
    // Validation des fichiers
    const validation = this.sourceService.validateFiles(files)

    if (!validation.valid) {
    this.fileValidationErrors = validation.errors
    return
  }

  this.fileValidationErrors = []
  this.selectedFiles = [...this.selectedFiles, ...files]
}

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1)
    this.fileValidationErrors = []
  }

  getFileSize(size: number): string {
    return (size / 1024 / 1024).toFixed(2)
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.sourceForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getFieldError(fieldName: string): string {
    const field = this.sourceForm.get(fieldName)
    if (field?.errors) {
      if (field.errors["required"]) {
        return "Ce champ est requis"
      }
      if (field.errors["minlength"]) {
        return `Minimum ${field.errors["minlength"].requiredLength} caractères`
      }
    }
    return ""
  }

  onSubmit(): void {
    if (this.sourceForm.valid) {
    this.isSubmitting = true

    const formData: CreateSourceFormData = this.sourceForm.value

    // Préparation des documents
    const documents: DocumentUpload[] = this.selectedFiles.map((file) => ({
      file,
      nom: file.name,
      type: file.type,
    }))

    this.sourceService.createSource(formData, documents).subscribe({
      next: (source) => {
        this.createdSource = source
        this.showSuccessModal = true
        this.isSubmitting = false
      },
      error: (error) => {
        console.error("Erreur lors de la création:", error)
        this.isSubmitting = false
        // Ici vous pourriez afficher un message d'erreur à l'utilisateur
      },
    })
  } else {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    Object.keys(this.sourceForm.controls).forEach((key) => {
      this.sourceForm.get(key)?.markAsTouched()
    })
  }
}

  saveDraft(): void {
    const formData: CreateSourceFormData = this.sourceForm.value

  this.sourceService.saveDraft(formData).subscribe({
    next: (response) => {
      console.log("Brouillon sauvegardé:", response)
      // Afficher un message de confirmation
    },
    error: (error) => {
      console.error("Erreur lors de la sauvegarde:", error)
    },
  })
}

  closeSuccessModal(): void {
    this.showSuccessModal = false
  }

  viewSource(): void {
    this.closeSuccessModal()
    // Navigation vers la vue de la source
    console.log("Navigation vers la source:", this.createdSource)
  }

  addAnother(): void {
    this.closeSuccessModal()
    this.sourceForm.reset()
    this.selectedFiles = []
    this.fileValidationErrors = []
    this.initializeForm()
    window.scrollTo(0, 0)
  }
}
