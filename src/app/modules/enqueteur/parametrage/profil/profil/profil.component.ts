import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProfilService} from "@modules/enqueteur/parametrage/profil/profil.service";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent {
  private fb = inject(FormBuilder)
  private settingsService = inject(ProfilService)

  profileForm: FormGroup
  isSubmitting = signal(false)
  successMessage = signal("")
  errorMessage = signal("")

  constructor() {
    const currentProfile = this.settingsService.userProfile()

    this.profileForm = this.fb.group({
      firstName: [currentProfile.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [currentProfile.lastName, [Validators.required, Validators.minLength(2)]],
      email: [currentProfile.email, [Validators.required, Validators.email]],
      phone: [currentProfile.phone, [Validators.required, Validators.pattern(/^\+?[0-9\s-]{10,}$/)]],
      position: [currentProfile.position, [Validators.required]],
      address: [currentProfile.address, [Validators.required]],
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getInputClass(fieldName: string): string {
    const baseClass = "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
    const errorClass = "border-red-300 focus:ring-red-500 focus:border-red-500"

    return this.isFieldInvalid(fieldName) ? errorClass : baseClass
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true)
      this.successMessage.set("")
      this.errorMessage.set("")

      try {
        await this.settingsService.updateProfile(this.profileForm.value)
        this.successMessage.set("Profil mis à jour avec succès")
        setTimeout(() => this.successMessage.set(""), 5000)
      } catch (error) {
        this.errorMessage.set("Erreur lors de la mise à jour du profil")
        setTimeout(() => this.errorMessage.set(""), 5000)
      } finally {
        this.isSubmitting.set(false)
      }
    }
  }
}
