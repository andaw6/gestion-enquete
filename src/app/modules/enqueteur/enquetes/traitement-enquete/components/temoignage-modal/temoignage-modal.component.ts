import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { AutreInfoModel, AutreInfoRequestData } from '@core/model/autre-info.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Logger } from '@core/services/logger.service';
import { AutreInfoService } from '@modules/enqueteur/enquetes/autre-info.service';
import { EnqueteModel } from '@core/model/enquete.model';
import { ToastService } from '@core/services/toast.service';
import { EnqueteStateService } from '@store/enquete/enquete-state.service';

@Component({
  selector: 'app-temoignage-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgIf, NgClass],
  templateUrl: './temoignage-modal.component.html',
  styleUrls: ['./temoignage-modal.component.css'],
})
export class TemoignageModalComponent implements OnChanges, OnInit {
  /** Inputs */
  @Input() open = false;
  enquete!: EnqueteModel;
  @Input() testimony?: AutreInfoModel; // édition
  @Input() autoSave = false;

  /** Outputs */
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AutreInfoRequestData>();
  @Output() nouveauTemoignage = new EventEmitter<{ action: "create" | "update", data: AutreInfoModel }>();

  /** Services */
  private readonly service = inject(AutreInfoService);
  private readonly toast = inject(ToastService);
  private readonly enqueteState = inject(EnqueteStateService);

  /** State */
  form: FormGroup;
  submitting = false;
  isSuccess = false;
  backendError: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.enqueteState.enquete$.subscribe(enquete => {
      if (enquete) {
        this.enquete = enquete;
      }
    })
  }

  /** Crée le formulaire avec valeurs par défaut */
  private buildForm(): FormGroup {
    const [date, heure] = this.getCurrentDateTime();
    return this.fb.group({
      objet: ['', [Validators.required, Validators.minLength(3)]],
      date: [date, Validators.required],
      heure: [heure],
      description: ['', [Validators.required, Validators.minLength(10)]],
      etat: ['00', Validators.required], // valeur par défaut
    });
  }

  /** Renvoie [date, heure] formatées */
  private getCurrentDateTime(baseDate: Date = new Date()): [string, string] {
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, '0');
    const day = String(baseDate.getDate()).padStart(2, '0');
    const hours = String(baseDate.getHours()).padStart(2, '0');
    const minutes = String(baseDate.getMinutes()).padStart(2, '0');

    return [`${year}-${month}-${day}`, `${hours}:${minutes}`];
  }

  /** Réagit aux changements d’inputs */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['testimony']?.currentValue && this.testimony) {
      const date = this.testimony.dateEnregistrement
        ? new Date(this.testimony.dateEnregistrement)
        : null;

      this.form.patchValue({
        objet: this.testimony.objet,
        description: this.testimony.description,
        date: date ? date.toISOString().split('T')[0] : '',
        heure: date ? date.toISOString().split('T')[1].substring(0, 5) : '',
        etat: this.testimony.etat?.code ?? '00',
      });
    }
  }

  /** Fermer la modal */
  onClose(): void {
    this.close.emit();
  }

  /** Sauvegarder le témoignage */
  onSave(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { objet, description, date, heure, etat } = this.form.value;
    const dateEnregistrement = date && heure ? new Date(`${date}T${heure}`) : null;

    const payload: AutreInfoRequestData = {
      categorie: 'temoignage',
      objet,
      description,
      importance: 3,
      codeEtat: etat,
      dateEnregistrement,
      enqueteId: this.enquete.id,
    };

    this.save.emit(payload);

    if (this.autoSave) {
      this.submit(payload);
    } else {
      this.toast.show("Ajouter du témoignage avec succès")
      this.onClose();
    }
  }

  /** Soumission API */
  private submit(data: AutreInfoRequestData): void {
    this.submitting = true;
    this.backendError = null;

    (
      !!this.testimony ?
        this.service.update(this.testimony.id!, data) :
        this.service.create(data)
    ).subscribe({
      next: (response) => {
        Logger.info({ message: 'Témoignage créé', data: response }, 'TemoignageModalComponent');
        this.submitting = false;
        this.isSuccess = true;

        // Ajout timestamps locaux
        response.createdAt = new Date();
        response.updatedAt = new Date();

        this.nouveauTemoignage.emit({ data: response, action: !!this.testimony ? "update" : "create" });
        this.toast.show('Témoignage enregistré avec succès.');
        this.onClose();
      },
      error: (err) => {
        this.submitting = false;
        this.isSuccess = false;
        this.backendError =
          err?.error?.message ?? "Erreur lors de l'enregistrement du témoignage.";
        this.toast.show("Erreur lors de l'enregistrement du témoignage.", 'error');
      },
    });
  }

  getTitle() {
    if (this.testimony) return "Modifier le témoignage"
    return "Nouveau témoignage"
  }

  getButtonText() {
    return this.testimony ? "Enregistre les modifications" : "Enregistrement le témoignage";
  }
}
