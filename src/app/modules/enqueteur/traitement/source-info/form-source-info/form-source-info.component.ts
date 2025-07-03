import {Component, OnInit, signal} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {EtatSourceInfo, SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";
import {Option, OptionSelect} from "@core/interfaces/option.interface";
import {DocumentService} from "@modules/enqueteur/traitement/document/document.service";
import {TypeSourceService} from "@modules/admin/parametrage/type-source/type-source.service";
import {TypeSource} from "@modules/admin/parametrage/type-source/type-source";
import {EtatSourceService} from "@modules/enqueteur/traitement/source-info/etat-source.service";
import {SourceInfoService} from "@modules/enqueteur/traitement/source-info/source-info.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationAlertService} from "@core/services/notification-alert.service";
import {forkJoin} from 'rxjs';
import {Document} from "@modules/enqueteur/traitement/document/document";
import {RELIABILITY_LEVELS} from "@config/constant";

@Component({
  selector: 'app-form-source-info',
  templateUrl: './form-source-info.component.html',
  styleUrls: ['./form-source-info.component.css']
})
export class FormSourceInfoComponent implements OnInit {
  sourceForm!: FormGroup;
  selectedFiles: File[] = [];
  etatsDisponibles: EtatSourceInfo[] = [];
  sourceTypes: TypeSource[] = [];
  isSubmitting: boolean = false;
  showSuccessModal: boolean = false;
  fileValidationErrors: string[] = [];
  selectedDocument: OptionSelect[] = [];
  option: OptionSelect[] = [];
  loadingDocument: boolean = false;
  wasEditing: boolean = false;
  sourceId: number | null = null;


  readonly documentIds = signal<number[]>([]);
  readonly reliabilityLevels: Option[] = RELIABILITY_LEVELS;
  private readonly key = "sourceInfo.draft";
  private draft: any = undefined;


  constructor(
    private readonly fb: FormBuilder,
    private readonly documentService: DocumentService,
    private readonly typeSourceService: TypeSourceService,
    private readonly etatSourceService: EtatSourceService,
    private readonly sourceInfoService: SourceInfoService,
    private readonly notificationService: NotificationAlertService,
    private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
    this.wasEditing = false;
    this.initializeForm();
    this.restoreDraft();
    this.loadInitialData();
  }

  initializeForm(): void {
    const today = new Date().toISOString().split("T")[0];
    this.sourceForm = this.fb.group({
      nom: ["", [Validators.required, Validators.minLength(3)]],
      type: ["", Validators.required],
      description: ["", [Validators.required, Validators.minLength(10)]],
      niveauFiabilite: ["", Validators.required],
      etat: [""],
      dateObtention: [today, [this.noFutureDateValidator()]],
      dateMiseAJour: ["", [this.noFutureDateValidator()]],
      commentaires: [""],
      enqueteAssociee: [""],
      ajouterAuxFavoris: [false],
    });
  }

  noFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const inputDate = new Date(control.value);
      const today = new Date();
      return inputDate > today ? {futureDate: true} : null;
    };
  }

  loadInitialData(): void {
    this.loadingDocument = true;

    forkJoin({
      documents: this.documentService.getAll(),
      types: this.typeSourceService.getAll(),
      etats: this.etatSourceService.getAll()
    }).subscribe({
      complete(): void {
        console.log("complete");
      },
      next: ({documents, types, etats}) => {
        this.option = documents.data.map(this.mapDocumentToOptionSelect);
        this.sourceTypes = types.data;
        this.etatsDisponibles = etats.data;
        this.loadingDocument = false;
        // Restauration des documents sélectionnés
        if (this.draft?.documentIds) {
          const idSet = new Set(this.draft.documentIds);
          this.selectedDocument = documents.data
            .filter(d => idSet.has(d.id))
            .map(this.mapDocumentToOptionSelect);
        }
      },
      error: err => {
        this.loadingDocument = false;
        this.notificationService.showNotification("Erreur de chargement des données", "error");
        console.error(err);
      }
    });
  }

  private mapDocumentToOptionSelect(doc: Document): OptionSelect {
    return {
      id: doc.id.toString(),
      label: `${doc.nom}.${doc.extension}`,
      description: `Type: ${doc.type.libelle} - Description: ${doc.description}`,
      value: doc.id.toString()
    };
  }

  restoreDraft(): void {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return;

      this.draft = JSON.parse(raw);
      if (this.draft && typeof this.draft === 'object') {
        if (this.draft.dateObtention && !isNaN(Date.parse(this.draft.dateObtention))) {
          this.draft.dateObtention = this.toDateInputValue(this.draft.dateObtention);
        }
        if (this.draft.dateMiseAJour && !isNaN(Date.parse(this.draft.dateMiseAJour))) {
          this.draft.dateMiseAJour = this.toDateInputValue(this.draft.dateMiseAJour);
        }
        this.sourceForm.patchValue(this.draft);
        if (Array.isArray(this.draft.documentIds)) {
          this.documentIds.set(this.draft.documentIds);
        }
        this.wasEditing = true;
      }
    } catch (err) {
      console.warn("Échec de restauration du brouillon:", err);
    }
  }

  onSelectDocument(select: OptionSelect[]): void {
    this.documentIds.set(select.map(s => Number(s.value)));
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.sourceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.sourceForm.get(fieldName);
    if (field?.errors) {
      if (field.errors["required"]) return "Ce champ est requis";
      if (field.errors["minlength"]) return `Minimum ${field.errors["minlength"].requiredLength} caractères`;
      if (field.errors["futureDate"]) return "La date ne peut pas être dans le futur";
    }
    return "";
  }

  getFormData(): Record<string, any> {
    const formValue = this.sourceForm.value;
    return {
      ...formValue,
      dateMiseAJour: formValue.dateMiseAJour ? new Date(formValue.dateMiseAJour) : null,
      dateObtention: formValue.dateObtention ? new Date(formValue.dateObtention) : null,
      documentIds: this.documentIds(),
      utilisateurId: 1
    };
  }

  onSubmit(): void {
    if (this.sourceForm.invalid) {
      this.markAllTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = this.getFormData();
    const request$ = this.isEditingMode()
      ? this.sourceInfoService.update(Number(this.draft.id), payload)
      : this.sourceInfoService.create(payload);

    this.sourceId = null;
    request$.subscribe({
      next: (data: SourceInfo) => {
        this.showSuccessModal = true;
        this.isSubmitting = false;
        localStorage.removeItem(this.key);
        this.draft = undefined;
        this.sourceId = data.id;
      },
      error: err => {
        this.isSubmitting = false;
        this.notificationService.showNotification(err.message || "Erreur lors de l'envoi des données", "error");
        console.error(err);
      }
    });
  }

  isEditingMode(): boolean {
    return !!(this.draft && this.draft.id);
  }

  saveDraft(): void {
    localStorage.setItem(this.key, JSON.stringify(this.getFormData()));
    this.notificationService.showNotification("Brouillon savegardez", "success");
  }

  markAllTouched(): void {
    Object.keys(this.sourceForm.controls).forEach(key => {
      this.sourceForm.get(key)?.markAsTouched();
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  viewSource(): void {
    this.closeSuccessModal();
    this.router.navigate(
      ["/enqueteur/traitement/source-info"],
      {queryParams: {show: this.sourceId}}
    ).then(console.info);
  }

  getTextButton(): string {
    return this.isEditingMode()
      ? (this.isSubmitting ? 'Modification...' : 'Modifier la Source')
      : (this.isSubmitting ? 'Création...' : 'Créer la Source');
  }

  addAnother(): void {
    this.closeSuccessModal();
    this.sourceForm.reset();
    this.selectedFiles = [];
    this.fileValidationErrors = [];
    this.documentIds.set([]);
    this.selectedDocument = [];
    this.initializeForm();
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  isValid(): boolean {
    return this.isSubmitting || this.sourceForm.invalid;
  }

  private toDateInputValue(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  goBack(): void {
    if (this.isEditingMode()) {
      const raw = localStorage.getItem("sourceInfo");
      if (raw) {
        localStorage.removeItem("sourceInfo");
        localStorage.setItem(this.key, raw);
      } else {
        localStorage.removeItem(this.key);
      }
    }
  }

}
