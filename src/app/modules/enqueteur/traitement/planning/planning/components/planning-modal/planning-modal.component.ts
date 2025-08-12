import {Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {
  EvenementCalendrier,
  EvenementCalendrierData, TypeEvenement
} from "@modules/enqueteur/traitement/planning/planning";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PlanningService} from "@modules/enqueteur/traitement/planning/planning.service";
import {UtilService} from "@core/services/util.service";
import {ResponseError} from "@core/interfaces/response-error.interface";
import {TypeEvenementService} from "@modules/enqueteur/traitement/planning/type-evenement.service";
import {ApiResponse} from "@core/interfaces/api-response.interface";


@Component({
  selector: 'app-planning-modal',
  templateUrl: './planning-modal.component.html',
  styleUrls: ['./planning-modal.component.css']
})
export class PlanningModalComponent implements OnChanges, OnInit {
  @Input() isOpen = false
  @Input() selectedDate = ""
  @Output() close = new EventEmitter<void>()
  @Output() eventCreated = new EventEmitter<void>()

  typeEvents: WritableSignal<TypeEvenement[]> = signal<TypeEvenement[]>([]);


  eventForm: FormGroup
  isSubmitting = signal(false)

  constructor(
    private readonly eventService: PlanningService,
    private fb: FormBuilder,
    private readonly utilService: UtilService,
    private readonly typeService: TypeEvenementService
  ) {
    this.eventForm = this.fb.group({
      title: ["", Validators.required],
      type: ["enquete".toUpperCase()],
      date: ["", Validators.required],
      time: ["", Validators.required],
      duration: [60, [Validators.min(0)]],
      priority: ["normale"],
      description: [""],
    })
  }

  ngOnInit(): void {
    this.loadData();
  }


  ngOnChanges(): void {
    if (this.selectedDate) {
      this.eventForm.patchValue({date: this.selectedDate})
    }
  }


  loadData(): void {
    this.typeService.getAll().subscribe({
      next: (response: ApiResponse<TypeEvenement>): void => {
        this.typeEvents.set(response.data);
      },
      error: (error: ResponseError): void => {
        this.utilService.showNotification(error.message || "Erreur lors du chargement des types d'événement", "error");
      }
    })
  }


  onClose(): void {
    this.eventForm.reset({
      type: "enquete",
      duration: 60,
      priority: "normale",
    })
    this.close.emit()
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose()
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true)

      const formValue = this.eventForm.value
      const newEvent: EvenementCalendrierData = {
        titre: formValue.title,
        typeCode: formValue.type,
        date: formValue.date,
        heure: formValue.time,
        duree: formValue.duration,
        priorite: formValue.priority,
        description: formValue.description,
        utilisateurId: 1
      }
      this.eventService.create(newEvent).subscribe({
        next: (data: EvenementCalendrier) => {
          this.eventService.setEvents([data, ...this.eventService.events()]);
          console.log(data)
          this.isSubmitting.set(false)
          this.eventCreated.emit()
        },
        error: (err: ResponseError) => {
          this.isSubmitting.set(false)
          this.utilService.showNotification(err.message || "Erreur lors de l'envoie des données", "error");
        }
      })
    }
  }
}
