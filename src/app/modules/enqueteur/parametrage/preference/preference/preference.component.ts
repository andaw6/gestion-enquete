import {Component, inject, signal} from '@angular/core';
import {ProfilService} from "@modules/enqueteur/parametrage/profil/profil.service";
import {FormBuilder, type FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent {
  private fb = inject(FormBuilder)
  private settingsService = inject(ProfilService)

  preferencesForm: FormGroup
  isSubmitting = signal(false)
  successMessage = signal("")
  errorMessage = signal("")

  constructor() {
    const currentPreferences = this.settingsService.userPreferences()

    this.preferencesForm = this.fb.group({
      theme: [currentPreferences.theme, [Validators.required]],
      language: [currentPreferences.language, [Validators.required]],
      timezone: [currentPreferences.timezone, [Validators.required]],
      dateFormat: [currentPreferences.dateFormat, [Validators.required]],
      timeFormat: [currentPreferences.timeFormat, [Validators.required]],
      itemsPerPage: [currentPreferences.itemsPerPage, [Validators.required, Validators.min(1)]],
    })
  }

  async onSubmit(): Promise<void> {
    if (this.preferencesForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true)
      this.successMessage.set("")
      this.errorMessage.set("")

      try {
        await this.settingsService.updatePreferences(this.preferencesForm.value)
        this.successMessage.set("Préférences mises à jour avec succès")
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
