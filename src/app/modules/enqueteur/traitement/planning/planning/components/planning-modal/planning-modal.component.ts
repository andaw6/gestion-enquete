import {Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {CalendarEvent} from "@modules/enqueteur/traitement/planning/planning";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PlanningService} from "@modules/enqueteur/traitement/planning/planning.service";


@Component({
  selector: 'app-planning-modal',
  templateUrl: './planning-modal.component.html',
  styleUrls: ['./planning-modal.component.css']
})
export class PlanningModalComponent {
  @Input() isOpen = false
  @Input() selectedDate = ""
  @Output() close = new EventEmitter<void>()
  @Output() eventCreated = new EventEmitter<void>()

  private fb = inject(FormBuilder)
  private calendarService = inject(PlanningService)

  eventForm: FormGroup
  isSubmitting = signal(false)

  constructor() {
    this.eventForm = this.fb.group({
      title: ["", Validators.required],
      type: ["enquete"],
      date: ["", Validators.required],
      time: ["", Validators.required],
      duration: [60, [Validators.min(0)]],
      priority: ["normale"],
      description: [""],
    })
  }

  ngOnChanges(): void {
    if (this.selectedDate) {
      this.eventForm.patchValue({ date: this.selectedDate })
    }
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
      const newEvent: Omit<CalendarEvent, "id"> = {
        title: formValue.title,
        type: formValue.type,
        date: formValue.date,
        time: formValue.time,
        duration: formValue.duration,
        priority: formValue.priority,
        description: formValue.description,
      }

      // Simulate API call
      setTimeout(() => {
        this.calendarService.addEvent(newEvent)
        this.isSubmitting.set(false)
        this.eventCreated.emit()
      }, 500)
    }
  }
}
