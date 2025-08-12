import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Option, OptionSelect } from '@core/interfaces/option.interface';
import { Concerne, DemandeEnqueteData } from '../model';
import { ConcerneService } from '../concerne.service';
import { UtilService } from '@core/services/util.service';
import { DemandeService } from '../demande.service';
import { DemandeEnquete } from '@modules/demandeur/dashboard/dashboard';
import { CustomValidators } from '@shared/validators/custom-validators';
import { UtilisateurStateService } from 'src/app/store/utilisateur/utilisateur-state.service';
import { Utilisateur } from '@core/interfaces/utilisateur.interface';

@Component({
  selector: 'app-nouvelle-demande',
  templateUrl: './nouvelle-demande.component.html',
  styleUrls: ['./nouvelle-demande.component.css']
})
export class NouvelleDemandeComponent {
  // UI labels
  pageTitle = "Nouvelle Demande d'Enquête";
  pageSubTitle = "Créer une nouvelle demande d'enquête";

  // Form and states
  demandeForm!: FormGroup;
  concerneMode: 'existing' | 'new' = 'existing';
  isSubmitting = false;
  isActionLoading = false;

  // Modal
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
  concernes = signal<Concerne[]>([]);
  selectedConcerne = signal<OptionSelect[]>([]);

  mesOptions = computed<OptionSelect[]>(() =>
    this.concernes().map(c => ({
      id: c.id,
      label: `${c.type.toUpperCase()} - ${c.numero} - ${c.regionSocial}`,
      value: `${c.id}`
    }))
  );

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

  user!: Utilisateur;

  constructor(
    private fb: FormBuilder,
    private concerneService: ConcerneService,
    private utilService: UtilService,
    private demandeService: DemandeService,
    private utilisateurState: UtilisateurStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.utilisateurState.user$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.initializeForm();
    this.loadConcerne();
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

  private loadConcerne(): void {
    this.isLoadingConcerne.set(true);
    this.concerneService.getAll({ sort: "createdAt,desc" }).subscribe({
      next: res => this.concernes.set(res.data),
      error: err => this.utilService.showNotification(err.message ?? "Erreur lors du chargement des concernés", "error"),
      complete: () => this.isLoadingConcerne.set(false)
    });
  }

  // ----------------- Form helpers -----------------

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
        })
    };

    this.demandeService.create(demande).subscribe({
      next: (data: DemandeEnquete) => {
        console.log("Nouvelle demande créée", data);
        this.utilService.showNotification("Demande d'enquête soumise avec succès");
        this.resetForm();
      },
      error: err => {
        this.utilService.showNotification(err.message ?? "Erreur lors de l'enregistrement", "error");
        this.isSubmitting = false;
      },
      complete: () => this.isSubmitting = false
    });
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
  }

  onGoBack(): void {
    window.history.back();
  }

}
