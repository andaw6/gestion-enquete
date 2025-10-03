import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { CommonModule, NgForOf, NgIf } from '@angular/common'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { Option } from '@core/interfaces/option.interface'
import { EnqueteModel } from '@core/model/enquete.model';
import { AutreInfoModel, AutreInfoRequestData } from '@core/model/autre-info.model';
import { AutreInfoService } from '@modules/enqueteur/enquetes/autre-info.service';
import { ToastService } from '@core/services/toast.service';
import { EnqueteStateService } from '@store/enquete/enquete-state.service';
import { Logger } from '@core/services/logger.service';

@Component({
  selector: 'app-observation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgForOf, NgIf, FormsModule],
  templateUrl: './observation-modal.component.html',
  styleUrls: ['./observation-modal.component.css']
})
export class ObervationModalComponent implements OnInit, OnChanges {
  /** Inputs */
  @Input() open = false;
  @Input() observation?: AutreInfoModel; // édition
  @Input() autoSave = false;

  /** Outputs */
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ action: "create" | "update", data: AutreInfoModel | AutreInfoRequestData }>();

  /** Services */
  private readonly service = inject(AutreInfoService);
  private readonly toast = inject(ToastService);
  private readonly enqueteState = inject(EnqueteStateService);

  /** propriété interne */
  enquete!: EnqueteModel;
  backendError: string | null = null;
  submitting: boolean = false;
  isSuccess: boolean = false;

  form: FormGroup

  categoryOptions: Option[] = [
    { value: 'observation-inspection', label: 'Inspection' },
    { value: 'observation-security', label: 'Sécurité' },
    { value: 'observation-procedure', label: 'Procédure' },
    { value: 'observation-correction', label: 'Correction' },
    { value: 'observation-follow-up', label: 'Suivi' },
    { value: 'observation-other', label: 'Autre' },
  ]

  priorityOptions: Option[] = [
    { value: 3, label: 'Basse' },
    { value: 2, label: 'Moyenne' },
    { value: 1, label: 'Haute' },
  ]


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
      title: ['', Validators.required, Validators.minLength(3)],
      category: ['', Validators.required],
      priority: [2, Validators.required],
      date: [date, Validators.required],
      time: [heure],
      description: ['', [Validators.required, Validators.minLength(10)]],
      etat: ['01'], // valeur par défaut
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
    if (changes['observation']?.currentValue && this.observation) {
      const date = this.observation.dateEnregistrement
        ? new Date(this.observation.dateEnregistrement)
        : null;

      this.form.patchValue({
        title: this.observation.objet,
        category: this.observation.categorie,
        description: this.observation.description,
        date: date ? date.toISOString().split('T')[0] : '',
        time: date ? date.toISOString().split('T')[1].substring(0, 5) : '',
        etat: this.observation.etat?.code ?? '01',
      });
    }
  }





  onClose() {
    this.close.emit()
    this.form.reset({ priority: 'medium' })
  }

  onSave() {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title: objet, category: categorie, description, date, time: heure, etat: codeEtat, priority: importance } = this.form.value;

    const dateEnregistrement = date && heure ? new Date(`${date}T${heure}`) : null;

    const payload: AutreInfoRequestData = {
      categorie,
      objet,
      description,
      importance,
      codeEtat,
      dateEnregistrement,
      enqueteId: this.enquete.id,
    }

    if (this.autoSave) {
      this.submit(payload);
    } else {
      this.save.emit({ data: payload, action: !!this.observation ? "update" : "create" });
      this.toast.show("Ajouter de l'observation avec succès")
      this.onClose();
    }
  }

  /** Soumission API */
  private submit(data: AutreInfoRequestData): void {
    this.submitting = true;
    this.backendError = null;

    (
      !!this.observation ?
        this.service.update(this.observation.id!, data) :
        this.service.create(data)
    ).subscribe({
      next: (response) => {
        Logger.info({ message: 'Observation créé', data: response }, 'ObservationModalComponent:submit');
        this.submitting = false;
        this.isSuccess = true;

        // Ajout timestamps locaux
        response.createdAt = new Date();
        response.updatedAt = new Date();

        this.save.emit({ data: response, action: !!this.observation ? "update" : "create" });
        this.toast.show('Observation enregistré avec succès.');
        this.onClose();
      },
      error: (err) => {
        this.submitting = false;
        this.isSuccess = false;
        this.backendError =
          err?.error?.message ?? "Erreur lors de l'enregistrement du observation.";
        this.toast.show("Erreur lors de l'enregistrement du observation.", 'error');
      },
    });
  }
}
