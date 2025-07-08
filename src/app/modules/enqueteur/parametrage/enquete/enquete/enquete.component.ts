import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProfilService} from "@modules/enqueteur/parametrage/profil/profil.service";

@Component({
  selector: 'app-enquete',
  templateUrl: './enquete.component.html',
  styleUrls: ['./enquete.component.css']
})
export class EnqueteComponent {
  private fb = inject(FormBuilder)
  private settingsService = inject(ProfilService)

  enquetesForm: FormGroup
  isSubmitting = signal(false)
  successMessage = signal("")
  errorMessage = signal("")

  constructor() {
    const currentSettings = this.settingsService.enqueteSettings()

    this.enquetesForm = this.fb.group({
      employeurs: [currentSettings.preferredTypes.includes("employeurs")],
      travailleurs: [currentSettings.preferredTypes.includes("travailleurs")],
      beneficiaires: [currentSettings.preferredTypes.includes("beneficiaires")],
      maxWorkload: [currentSettings.maxWorkload, [Validators.required, Validators.min(1)]],
      responseDelay: [currentSettings.responseDelay, [Validators.required]],
      autoAcceptLowPriority: [currentSettings.autoAcceptLowPriority],
      acceptOutsideHours: [currentSettings.acceptOutsideHours],
      startTime: [currentSettings.workingHours.start, [Validators.required]],
      endTime: [currentSettings.workingHours.end, [Validators.required]],
      lundi: [currentSettings.workingHours.days.includes("lundi")],
      mardi: [currentSettings.workingHours.days.includes("mardi")],
      mercredi: [currentSettings.workingHours.days.includes("mercredi")],
      jeudi: [currentSettings.workingHours.days.includes("jeudi")],
      vendredi: [currentSettings.workingHours.days.includes("vendredi")],
      samedi: [currentSettings.workingHours.days.includes("samedi")],
      dimanche: [currentSettings.workingHours.days.includes("dimanche")],
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.enquetesForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getInputClass(fieldName: string): string {
    const baseClass = "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
    const errorClass = "border-red-300 focus:ring-red-500 focus:border-red-500"

    return this.isFieldInvalid(fieldName) ? errorClass : baseClass
  }

  async onSubmit(): Promise<void> {
    if (this.enquetesForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true)
      this.successMessage.set("")
      this.errorMessage.set("")

      try {
        const formValue = this.enquetesForm.value
        const preferredTypes = []
        if (formValue.employeurs) preferredTypes.push("employeurs")
        if (formValue.travailleurs) preferredTypes.push("travailleurs")
        if (formValue.beneficiaires) preferredTypes.push("beneficiaires")

        const workingDays = []
        if (formValue.lundi) workingDays.push("lundi")
        if (formValue.mardi) workingDays.push("mardi")
        if (formValue.mercredi) workingDays.push("mercredi")
        if (formValue.jeudi) workingDays.push("jeudi")
        if (formValue.vendredi) workingDays.push("vendredi")
        if (formValue.samedi) workingDays.push("samedi")
        if (formValue.dimanche) workingDays.push("dimanche")

        const settings = {
          preferredTypes,
          maxWorkload: formValue.maxWorkload,
          responseDelay: formValue.responseDelay,
          autoAcceptLowPriority: formValue.autoAcceptLowPriority,
          acceptOutsideHours: formValue.acceptOutsideHours,
          workingHours: {
            start: formValue.startTime,
            end: formValue.endTime,
            days: workingDays,
          },
        }

        await this.settingsService.updateEnqueteSettings(settings)
        this.successMessage.set("Préférences d'enquêtes mises à jour avec succès")
        setTimeout(() => this.successMessage.set(""), 5000)
      } catch (error) {
        this.errorMessage.set("Erreur lors de la mise à jour des préférences")
        setTimeout(() => this.errorMessage.set(""), 5000)
      } finally {
        this.isSubmitting.set(false)
      }
    }
  }
}
