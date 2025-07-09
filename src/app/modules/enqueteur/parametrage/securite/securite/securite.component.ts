import {Component, inject, signal} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProfilService} from "@modules/enqueteur/parametrage/profil/profil.service";
import {Save} from "lucide-angular";


function passwordMatchValidator(control: AbstractControl) {
  const newPassword = control.get("newPassword")
  const confirmPassword = control.get("confirmPassword")

  if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
    return {passwordMismatch: true}
  }
  return null
}


@Component({
  selector: 'app-securite',
  templateUrl: './securite.component.html',
  styleUrls: ['./securite.component.css']
})
export class SecuriteComponent {
  private fb = inject(FormBuilder)
  private settingsService = inject(ProfilService)
  readonly iconSave = Save;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;


  passwordForm: FormGroup
  isPasswordSubmitting = signal(false)
  passwordSuccessMessage = signal("")
  passwordErrorMessage = signal("")
  twoFactorEnabled = signal(false)

  constructor() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", [Validators.required]],
        newPassword: [
          "",
          [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)],
        ],
        confirmPassword: ["", [Validators.required]],
      },
      {validators: passwordMatchValidator},
    )
  }

  isPasswordFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getInputClass(fieldName: string): string {
    const baseClass = "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
    const errorClass = "border-red-300 focus:ring-red-500 focus:border-red-500"

    return this.isPasswordFieldInvalid(fieldName) ? errorClass : baseClass
  }

  async onPasswordSubmit(): Promise<void> {
    if (this.passwordForm.valid && !this.isPasswordSubmitting()) {
      this.isPasswordSubmitting.set(true)
      this.passwordSuccessMessage.set("")
      this.passwordErrorMessage.set("")

      try {
        await this.settingsService.changePassword(this.passwordForm.value)
        this.passwordSuccessMessage.set("Mot de passe modifié avec succès")
        this.passwordForm.reset()
        setTimeout(() => this.passwordSuccessMessage.set(""), 5000)
      } catch (error) {
        this.passwordErrorMessage.set(
          error instanceof Error ? error.message : "Erreur lors de la modification du mot de passe",
        )
        setTimeout(() => this.passwordErrorMessage.set(""), 5000)
      } finally {
        this.isPasswordSubmitting.set(false)
      }
    }
  }

  toggleTwoFactor(event: Event): void {
    const target = event.target as HTMLInputElement
    this.twoFactorEnabled.set(target.checked)
  }

  disconnectSession(sessionId: string): void {
    console.log("Disconnecting session:", sessionId)
  }
}
