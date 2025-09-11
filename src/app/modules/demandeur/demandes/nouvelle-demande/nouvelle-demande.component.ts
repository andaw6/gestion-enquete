import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Option, OptionSelect } from '@core/interfaces/option.interface';
import { UtilService } from '@core/services/util.service';
import { CustomValidators } from '@shared/validators/custom-validators';
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';
import { Utilisateur } from '@core/interfaces/utilisateur.interface';
import { DemandeEnqueteData, DemandeEnqueteModel, DemandeEtatDemande } from '@core/model/demande-enquete.model';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SelectSearchPaginateComponent } from '@shared/components/select-search-paginate/select-search-paginate.component';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { ConcerneModel } from '@core/model/concerne.model';
import { DocumentService } from '@modules/enqueteur/traitement/document/document.service';
import { DocumentModel } from '@core/model/document.model';
import { Logger } from '@core/services/logger.service';
import { forkJoin } from 'rxjs';
import { ConcerneService } from '../concerne.service';
import { DemandeService } from '../demande.service';


@Component({
  selector: 'app-nouvelle-demande',
  templateUrl: './nouvelle-demande.component.html',
  styleUrls: ['./nouvelle-demande.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    SelectSearchPaginateComponent,
    ConfirmationModalComponent
  ],
})
export class NouvelleDemandeComponent {
  // Injection des dépendances
  private fb = inject(FormBuilder);
  private concerneService = inject(ConcerneService);
  private utilService = inject(UtilService);
  private demandeService = inject(DemandeService);
  private utilisateurState = inject(UtilisateurStateService);
  private readonly documentService = inject(DocumentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // UI labels
  pageTitle = computed<string>(() => this.isEditMode() ? "Modifer une demande d'enquête" : "Nouvelle demande d'enquête");
  pageSubTitle = computed<string>(() => this.isEditMode() ? "Modifier les informations de la demande d'enquête" : "Créer une nouvelle demande d'enquête");
  pageButtonIcon = computed<string>(() => this.isEditMode() ? "fas fa-times" : "fas fa-long-arrow-alt-left");
  pageButtonText = computed<string>(() => this.isEditMode() ? "Annulée" : "Retour");

  // Form and states
  demandeForm!: FormGroup;
  concerneMode: 'existing' | 'new' = 'existing';
  isSubmitting = false;
  isActionLoading = false;

  // Modal
  isSuccess = false;
  showConfirmModal = false;
  confirmationData = {
    title: "Réinitialiser le formulaire",
    message: "Êtes-vous sûr de vouloir réinitialiser le formulaire ? Toutes les données saisies seront perdues."
  };

  // Notifications
  showNotification = false;
  notificationMessage = "";
  notificationType: 'success' | 'error' | 'info' = 'info';

  // Concernés
  isLoadingConcerne = signal<boolean>(false);
  concernes = signal<ConcerneModel[]>([]);
  selectedConcerne = signal<OptionSelect[]>([]);
  defaultConcerne = signal<OptionSelect[]>([]);
  mesOptions = computed<OptionSelect[]>(() =>
    this.concernes().map(c => ({
      id: c.id,
      label: `${c.type.toUpperCase()} - ${c.telephone} - ${c.regionSocial}`,
      value: `${c.id}`
    }))
  );

  // Documents
  selectedDocument = signal<OptionSelect[]>([]);
  documentOptions = signal<OptionSelect[]>([]);
  selectedFiles: File[] = []
  documentNames: string[] = []
  readonly documentIds = signal<number[]>([]);

  // Dropdown options
  prioriteOptions: Option[] = [
    { value: 1, label: "1 - Très élevée" },
    { value: 2, label: "2 - Élevée" },
    { value: 3, label: "3 - Normale" },
    { value: 4, label: "4 - Faible" },
    { value: 5, label: "5 - Très faible" }
  ];

  typeOptions: Option[] = [
    { value: "employeur", label: "Employeur" },
    { value: "beneficiaire", label: "Bénéficiaire" },
    { value: "travailleur", label: "Travailleur" }
  ];

  // Utilisateur connecté
  user!: Utilisateur;

  // Demande
  demandeCreer: DemandeEnqueteModel | null = null;
  isEditMode = signal<boolean>(false);
  demandeId = signal<number>(0);
  demandeAModifier = signal<DemandeEnqueteModel | null>(null);

  ngOnInit(): void {
    this.utilisateurState.user$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    this.route.paramMap.subscribe(params => {
      this.isEditMode.set(false);
      this.demandeId.set(0);
      const id = params.get('id');
      if (!!id) {
        this.isEditMode.set(true);
        this.demandeId.set(Number(id!));
        this.loadDemande();
      }
    });

    this.initializeForm();
    this.loadData();

  }

  // ----------------- Initialisation -----------------
  private initializeForm(): void {
    this.demandeForm = this.fb.group({
      objet: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      priorite: ["", Validators.required],
      dateEcheance: ["", [Validators.required, CustomValidators.dateNotInPastValidator()]],
      urgent: [false],
      concerneId: [""],
      type: [""],
      numero: [""],
      regionSocial: [""],
      centreId: ["", Validators.required]
    });

    this.updateConcerneValidators();
  }

  private patchForm(demande: DemandeEnqueteModel): void {
    this.selectedDocument.set([]);
    this.documentIds.set([]);
    this.demandeForm.patchValue({
      objet: demande.objet,
      description: demande.description,
      priorite: demande.priorite,
      dateEcheance: demande.dateEcheance,
      urgent: demande.urgent,
      centreId: demande.centre?.code ?? "afrilins",
      concerneId: demande.concerne?.id ?? "",
      type: demande.concerne?.type ?? "",
      numero: demande.concerne?.telephone ?? "",
      regionSocial: demande.concerne?.regionSocial ?? ""
    });

    // Mettre le mode concerne
    if (demande.concerne) {
      this.concerneMode = 'existing';
      this.defaultConcerne.set([{
        id: demande.concerne.id,
        label: `${demande.concerne.type.toUpperCase()} - ${demande.concerne.telephone} - ${demande.concerne.regionSocial}`,
        value: demande.concerne.id.toString()
      }]);
    } else {
      this.concerneMode = 'new';
    }

    this.updateConcerneValidators();

    // Documents déjà liés
    if (demande.documents && demande.documents.length > 0) {
      const docs = demande.documents.map(d => this.mapDocumentToOptionSelect(d));
      this.documentOptions.set(docs);
      this.selectedDocument.set(docs);
      this.documentIds.set(docs.map(d => Number(d.id)));
    }
  }




  loadData() {
    this.isLoadingConcerne.set(true);
    forkJoin({
      documents: this.documentService.getAll(),
      concernes: this.concerneService.getAll({ sort: "createdAt,desc" })
    }).subscribe({
      next: ({ documents, concernes }) => {
        this.isLoadingConcerne.set(false);
        this.concernes.set(concernes.data);
        this.documentOptions.set(
          documents.data.map(this.mapDocumentToOptionSelect)
        )
      },
      error: err => {
        this.isLoadingConcerne.set(false);
      }
    })
  }

  loadDemande() {
    if (this.demandeId()) {
      this.demandeService.getOne(this.demandeId())
        .subscribe({
          next: response => {
            this.demandeAModifier.set(response);
            if (!!response) {
              this.patchForm(response!);
              this.demandeAModifier.update(last => ({
                ...last!,
                commentaireValidation: "En attente de validation par le responsable. Vérification des documents en cours."
              }));
            }
            Logger.info({ message: "Demande à modifier", data: response }, "NouvelleDemandeComponent:loadDemande");
          },
          error: _ => {
            this.utilService.showNotification("Erreur lors du chargement de la demande", "error");
          }
        })

    }
  }

  reset() {
    if (this.isEditMode()) {
      if (!!this.demandeAModifier()) {
        this.patchForm(this.demandeAModifier()!);
      }
    } else {
      this.showConfirmModal = true;
    }
  }


  // ----------------- Form helpers -----------------

  onSelectDocument(select: OptionSelect[]): void {
    this.documentIds.set(select.map(s => Number(s.value)));
  }

  onSelected(options: OptionSelect[]): void {
    this.selectedConcerne.set(options);
    this.demandeForm.get("concerneId")?.reset();
    if (options.length === 1) {
      this.demandeForm.get("concerneId")?.setValue(options[0].id);
    }
  }



  onConcerneModeChange(mode: 'existing' | 'new'): void {
    this.concerneMode = mode;
    this.updateConcerneValidators();
  }

  private updateConcerneValidators(): void {
    const controls = this.demandeForm.controls;

    if (this.concerneMode === 'existing') {
      controls['concerneId'].setValidators([Validators.required]);
      controls['type'].clearValidators();
      controls['numero'].clearValidators();
      controls['regionSocial'].clearValidators();
    } else {
      controls['concerneId'].clearValidators();
      controls['type'].setValidators([Validators.required]);
      controls['numero'].setValidators([Validators.required, Validators.pattern(/^[+]?[\d\s\-]{6,15}$/)]);
      controls['regionSocial'].setValidators([Validators.required, Validators.minLength(3)]);
    }

    Object.values(controls).forEach(control => control.updateValueAndValidity());
  }


  getFieldError(fieldName: string): string | null {
    const field = this.demandeForm.get(fieldName);
    if (field?.invalid && (field.dirty || field.touched)) {
      if (field.errors?.["required"]) return "Ce champ est obligatoire";
      if (field.errors?.["minlength"]) return `Minimum ${field.errors["minlength"].requiredLength} caractères requis`;
      if (field.errors?.["maxlength"]) return `Maximum ${field.errors["maxlength"].requiredLength} caractères autorisés`;
      if (field.errors?.["dateInPast"]) return "La date d'échéance ne peut pas être antérieure à aujourd'hui";
      if (field.errors?.["pattern"]) return "Format de numéro invalide (seulement chiffres, +, espaces ou tirets)";
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.demandeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  markAllFieldsAsTouched(): void {
    Object.keys(this.demandeForm.controls).forEach(key =>
      this.demandeForm.get(key)?.markAsTouched()
    );
  }

  getMinDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  // ----------------- Actions -----------------

  onSubmit(): void {
    if (this.demandeForm.invalid) {
      this.markAllFieldsAsTouched();
      return this.utilService.showNotification("Veuillez corriger les erreurs dans le formulaire", "error");
    }

    this.isSubmitting = true;
    const form = this.demandeForm.value;
    this.demandeCreer = null;

    const demande: DemandeEnqueteData = {
      objet: form.objet,
      description: form.description,
      priorite: Number(form.priorite),
      dateEcheance: form.dateEcheance,
      urgent: form.urgent,
      centre: form.centreId,
      utilisateurId: this.user.id,
      ...(this.concerneMode === 'existing'
        ? { concerneId: Number(form.concerneId) }
        : {
          concerne: {
            type: form.type,
            numero: form.numero,
            regionSocial: form.regionSocial
          }
        }),
      documentIds: this.documentIds(),
    };

    this.isSuccess = false;
    const data = { documents: this.selectedFiles, demande };


    (
      this.isEditMode() ?
        this.demandeService.updateWithDocument(this.demandeId(), data) :
        this.demandeService.createWithDocument(data)
    )
      .subscribe({
        next: (data: DemandeEnqueteModel) => {
          this.demandeCreer = data;
          this.utilService.showNotification(
            this.isEditMode() ?
              "Demande d'enquête mis à jour avec succès" :
              "Demande d'enquête soumise avec succès"
          );
          this.isSuccess = true;
          this.isSubmitting = false;
        },
        error: err => {
          Logger.error({ message: "Erreur", data: err }, "NouvelleDemandeComponent");
          this.utilService.showNotification("Erreur lors de l'enregistrement", "error");
          this.isSubmitting = false;
        },
        complete: () => { }
      });
  }

  nouveauDemande() {
    if (this.isEditMode()) {
      this.isEditMode.set(false);
      this.demandeId.set(0)
    }
    this.resetForm();
    this.isSuccess = false;
  }


  onSaveDraft(): void {
    console.log("Brouillon sauvegardé:", this.demandeForm.value);
    this.utilService.showNotification("Brouillon sauvegardé avec succès", "info");
  }

  resetForm(): void {
    this.demandeForm.reset();
    this.concerneMode = 'existing';
    this.updateConcerneValidators();
    this.selectedConcerne.set([]);
    this.documentIds.set([]);
    this.selectedDocument.set([]);
    this.selectedFiles = [];
    this.documentNames = [];
  }

  onGoBack(): void {
    history.back();
  }


  showDetail() {
    if (!!this.demandeCreer) {
      this.router.navigate(["/demandeur/demandes/detail", this.demandeCreer.id])
    }
  }

canUpdate(): boolean {
  if (!this.isEditMode()) return false;

  // si pas de demande → autorisé
  if (!this.demandeId() || !this.demandeAModifier()) return true;

  const code = this.demandeAModifier()!.etat.code;
  return code === DemandeEtatDemande.EnAttente || code === DemandeEtatDemande.EnComplement;
}




  private fileKey(f: File): string {
    return `${f.name}|${f.size}|${f.lastModified}`
  }

  private addFiles(files: FileList | File[]): void {
    const incoming = Array.from(files)
    const existingKeys = new Set(this.selectedFiles.map(this.fileKey))
    const toAdd = incoming.filter(f => !existingKeys.has(this.fileKey(f)))

    if (toAdd.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...toAdd]
      this.documentNames = this.selectedFiles.map(file => {
        const dot = file.name.lastIndexOf('.')
        return dot > 0 ? file.name.substring(0, dot) : file.name
      })
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.addFiles(input.files)
      // Important : permet de re-déclencher (change) si on re-sélectionne le même fichier
      input.value = ''
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1)
    this.documentNames.splice(index, 1)
  }

  removeAllFiles(): void {
    this.selectedFiles = []
    this.documentNames = []
  }

  /** (optionnel) support du glisser-déposer */
  onDrop(event: DragEvent): void {
    event.preventDefault()
    if (event.dataTransfer?.files?.length) {
      this.addFiles(event.dataTransfer.files)
    }
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault()
  }


  private mapDocumentToOptionSelect(doc: DocumentModel): OptionSelect {
    return {
      id: doc.id.toString(),
      label: `${doc.nom}.${doc.extension}`,
      description: `Type: ${doc.type.libelle} - Description: ${doc.description}`,
      value: doc.id.toString()
    };
  }
}
