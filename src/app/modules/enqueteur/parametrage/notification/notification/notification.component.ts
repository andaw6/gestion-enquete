import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ProfilService} from "@modules/enqueteur/parametrage/profil/profil.service";
import {NotificationSettings} from "@modules/enqueteur/parametrage/profil/profil";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  private fb = inject(FormBuilder)
  private settingsService = inject(ProfilService)

  notificationForm: FormGroup
  isSubmitting = signal(false)
  successMessage = signal("")
  errorMessage = signal("")

  constructor() {
    const currentSettings = this.settingsService.notificationSettings()

    this.notificationForm = this.fb.group({
      enquetesNewAssignmentsEmail: [currentSettings.enquetes.newAssignments.email],
      enquetesNewAssignmentsSms: [currentSettings.enquetes.newAssignments.sms],
      enquetesNewAssignmentsPush: [currentSettings.enquetes.newAssignments.push],
      enquetesDeadlinesEmail: [currentSettings.enquetes.deadlines.email],
      enquetesDeadlinesSms: [currentSettings.enquetes.deadlines.sms],
      enquetesDeadlinesPush: [currentSettings.enquetes.deadlines.push],
      enquetesCommentsEmail: [currentSettings.enquetes.comments.email],
      enquetesCommentsSms: [currentSettings.enquetes.comments.sms],
      enquetesCommentsPush: [currentSettings.enquetes.comments.push],
      systemSecurityEmail: [currentSettings.system.security.email],
      systemMaintenanceEmail: [currentSettings.system.maintenance.email],
      systemMaintenancePush: [currentSettings.system.maintenance.push],
    })
  }

  async onSubmit(): Promise<void> {
    if (!this.isSubmitting()) {
      this.isSubmitting.set(true)
      this.successMessage.set("")
      this.errorMessage.set("")

      try {
        const formValue = this.notificationForm.value
        const settings = {
          enquetes: {
            newAssignments: {
              email: formValue.enquetesNewAssignmentsEmail,
              sms: formValue.enquetesNewAssignmentsSms,
              push: formValue.enquetesNewAssignmentsPush,
            },
            deadlines: {
              email: formValue.enquetesDeadlinesEmail,
              sms: formValue.enquetesDeadlinesSms,
              push: formValue.enquetesDeadlinesPush,
            },
            comments: {
              email: formValue.enquetesCommentsEmail,
              sms: formValue.enquetesCommentsSms,
              push: formValue.enquetesCommentsPush,
            },
          },
          system: {
            security: { email: formValue.systemSecurityEmail },
            maintenance: {
              email: formValue.systemMaintenanceEmail,
              push: formValue.systemMaintenancePush,
            },
          },
        }

        await this.settingsService.updateNotificationSettings(settings as NotificationSettings)
        this.successMessage.set("Préférences de notification mises à jour avec succès")
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
