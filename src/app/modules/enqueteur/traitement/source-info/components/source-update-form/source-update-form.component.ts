import { Component, EventEmitter, Input, OnChanges, type OnInit, Output, SimpleChanges } from "@angular/core"
import { CommonModule, NgClass, NgForOf, NgIf, } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators, FormsModule } from "@angular/forms"
import { SourceData, SourceInfoModel, SourceInfoRequestData } from "@core/model/source-info.model"
import { DocumentModel } from "@core/model/document.model"
import { UtilisateurModel } from "@core/model/utilisateur.model"
import { EnqueteModel } from "@core/model/enquete.model"
import { UtilService } from "@core/services/util.service"
import { Option } from "@core/interfaces/option.interface"
import { FileUploadComponent } from "@shared/components/file-upload/file-upload.component";

export interface SelectedDocument extends DocumentModel {
  isExisting: boolean
  file?: File
}


@Component({
  selector: 'app-source-update-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgClass, NgForOf, NgIf, NgClass, FileUploadComponent],
  templateUrl: './source-update-form.component.html',
  styleUrls: ['./source-update-form.component.css']
})
export class SourceUpdateFormComponent implements OnInit, OnChanges {
  @Input() isOpen = false
  @Input() sourceInfo: SourceInfoModel | null = null;
  @Input() enableEnqueteSelection = true // Toggle enquête selection
  @Input() enableUserSelection = false // Toggle enquête selection
  @Input() availableDocuments: DocumentModel[] = []
  @Input() availableEnquetes: EnqueteModel[] = []
  @Input() availableUsers: UtilisateurModel[] = []
  @Input() typeOptions: Option[] = []
  @Input() etatOptions: Option[] = []
  @Input() isSubmitting: boolean = false;

  @Output() closeModal = new EventEmitter<void>()
  @Output() submitForm = new EventEmitter<SourceData>()

  sourceInfoForm!: FormGroup
  selectedDocuments: SelectedDocument[] = []
  selectedEnqueteIds: number[] = []
  uploadedFiles: File[] = [];

  activeDocTab: "upload" | "select" = "upload"
  documentSearchTerm = ""
  enqueteSearchTerm = ""

  fiabiliteMax = 5;
  fiabiliteMin = 1;

  constructor(
    private fb: FormBuilder,
    protected readonly utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.initForm()

    if (this.sourceInfo) {
      this.populateForm()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["sourceInfo"] && changes["sourceInfo"].currentValue) {
      this.populateForm();
    }

    if (!!changes["isSubmitting"]) {
      this.isSubmitting = changes["isSubmitting"].currentValue ?? false;
    }
  }

  private initForm(): void {
    this.sourceInfoForm = this.fb.group({
      nom: ["", Validators.required],
      description: ["", Validators.required],
      commentaires: [""],
      fiabilite: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      codeEtat: ["", Validators.required],
      codeType: ["", Validators.required],
      utilisateurId: [null, Validators.required],
      dateObtention: [""],
      dateMiseAJour: [""],
    })
  }

  private populateForm(): void {
    this.isSubmitting = false;
    if (!this.sourceInfo) return;
    this.sourceInfoForm.patchValue({
      nom: this.sourceInfo.nom,
      description: this.sourceInfo.description,
      commentaires: this.sourceInfo.commentaires,
      fiabilite: this.sourceInfo.fiabilite,
      codeEtat: this.sourceInfo.etat.code,
      codeType: this.sourceInfo.type.code,
      utilisateurId: this.sourceInfo.utilisateur.id,
      dateObtention: this.formatDateForInput(this.sourceInfo.dateObtention),
      dateMiseAJour: this.formatDateForInput(this.sourceInfo.dateMiseAJour),
    })

    this.selectedDocuments = this.sourceInfo.documents.map((doc) => ({
      ...doc,
      isExisting: true,
    }))

    this.selectedEnqueteIds = this.sourceInfo.enquetes.map((e) => e.id)
  }

  private formatDateForInput(date: Date | null): string {
    if (!date) return ""
    const d = new Date(date)
    return d.toISOString().split("T")[0]
  }

  onClose(): void {
    this.closeModal.emit()
  }

  onSubmit(): void {
    this.isSubmitting = false
    if (this.sourceInfoForm.invalid) {
      this.sourceInfoForm.markAllAsTouched()
      return
    }

    const formValue = this.sourceInfoForm.value
    const requestData: SourceInfoRequestData = {
      ...formValue,
      documentIds: this.selectedDocuments.filter((d) => d.isExisting).map((d) => d.id),
      enqueteIds: this.selectedEnqueteIds,
      id: this.sourceInfo?.id
    }
    this.isSubmitting = true;
    this.submitForm.emit({ data: { source: requestData, files: this.uploadedFiles }, mode: "update" })
  }

  // Document management
  switchDocTab(tab: "upload" | "select"): void {
    this.activeDocTab = tab
  }



  addDocument(doc: DocumentModel): void {
    if (this.selectedDocuments.some((d) => d.id === doc.id && d.isExisting)) {
      return
    }
    this.selectedDocuments.push({ ...doc, isExisting: true })
  }

  removeDocument(id: number, isExisting: boolean): void {
    this.selectedDocuments = this.selectedDocuments.filter((d) => !(d.id === id && d.isExisting === isExisting))
    if (!isExisting) {
      this.uploadedFiles.splice(id, 1);
    }
  }

  onFilesAdded(files: File[]): void {
    files.forEach((file, idx) => {
      const newDoc: SelectedDocument = {
        id: Date.now() + idx,
        nom: file.name,
        description: "",
        chemin: "",
        extension: file.name.split(".").pop() || "",
        taille: file.size,
        version: 1,
        type: { code: "PJSOURCE", libelle: "Pièce jointe source d'information" },
        createdAt: null,
        updatedAt: null,
        isExisting: false,
        file: file,
      }
      this.selectedDocuments.push(newDoc)
      this.uploadedFiles.push(file);
    })
  }



  get filteredAvailableDocuments(): DocumentModel[] {
    return this.availableDocuments.filter((doc) => {
      const isNotSelected = !this.selectedDocuments.some((sd) => sd.id === doc.id && sd.isExisting)
      const matchesSearch = doc.nom.toLowerCase().includes(this.documentSearchTerm.toLowerCase())
      return isNotSelected && matchesSearch
    })
  }

  // Enquête management
  toggleEnquete(id: number): void {
    const index = this.selectedEnqueteIds.indexOf(id)
    if (index > -1) {
      this.selectedEnqueteIds.splice(index, 1)
    } else {
      this.selectedEnqueteIds.push(id)
    }
  }

  isEnqueteSelected(id: number): boolean {
    return this.selectedEnqueteIds.includes(id)
  }

  get filteredEnquetes(): EnqueteModel[] {
    return this.availableEnquetes.filter(
      (enq) =>
        enq.reference.toLowerCase().includes(this.enqueteSearchTerm.toLowerCase()) ||
        (enq.demande?.objet || "").toLowerCase().includes(this.enqueteSearchTerm.toLowerCase()),
    )
  }

  get selectedEnquetes(): EnqueteModel[] {
    return this.availableEnquetes.filter((e) => this.selectedEnqueteIds.includes(e.id))
  }

  // Utility methods
  getFiabiliteBarWidth(): string {
    const fiabilite = this.sourceInfoForm.get("fiabilite")?.value || 0;
    if (fiabilite == 0) return "0%";
    const clamped = Math.min(Math.max(fiabilite, this.fiabiliteMin), this.fiabiliteMax);
    const percent = ((clamped - this.fiabiliteMin) / (this.fiabiliteMax - this.fiabiliteMin)) * 100;
    return `${percent}%`;
  }

  getFiabiliteBarColor(): string {
    const value = this.sourceInfoForm.get("fiabilite")?.value || 0
    if (value < 3) return "bg-red-500"
    if (value < 4) return "bg-yellow-500"
    return "bg-primary"
  }


  getEnqueteStateBadge(code: string): string {
    const badges: { [key: string]: string } = {
      "00": "bg-yellow-100 text-yellow-700", // En attente
      "01": "bg-blue-100 text-blue-700",     // En cours
      "02": "bg-green-100 text-green-700",   // Terminée
      "03": "bg-purple-100 text-purple-700", // En validation
      "04": "bg-emerald-100 text-emerald-700", // Validée
      "05": "bg-orange-100 text-orange-700", // En révision
      "06": "bg-red-100 text-red-700",       // Annulée
    }
    return badges[code] || "bg-gray-100 text-gray-700"
  }


  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose()
    }
  }
}
