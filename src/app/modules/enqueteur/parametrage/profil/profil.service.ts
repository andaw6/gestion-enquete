import {Injectable, signal} from '@angular/core';
import {
  EnqueteSettings,
  NotificationSettings, PasswordChange, PrivacySettings,
  UserPreferences,
  UserProfile
} from "@modules/enqueteur/parametrage/profil/profil";

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  private userProfileSignal = signal<UserProfile>({
    firstName: "Fatou",
    lastName: "Sall",
    email: "fatou.sall@afrilins.sn",
    phone: "+221 77 123 45 67",
    position: "Enquêtrice Senior",
    address: "Quartier Liberté 6, Dakar, Sénégal",
  })

  private notificationSettingsSignal = signal<NotificationSettings>({
    enquetes: {
      newAssignments: { email: true, sms: true, push: false },
      deadlines: { email: true, sms: false, push: true },
      comments: { email: true, sms: false, push: false },
    },
    system: {
      security: { email: true },
      maintenance: { email: true, push: false },
    },
  })

  private userPreferencesSignal = signal<UserPreferences>({
    theme: "auto",
    language: "fr",
    timezone: "GMT+0",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24",
    itemsPerPage: 25,
  })

  private enqueteSettingsSignal = signal<EnqueteSettings>({
    preferredTypes: ["employeurs", "travailleurs"],
    maxWorkload: 10,
    responseDelay: 24,
    autoAcceptLowPriority: true,
    acceptOutsideHours: false,
    workingHours: {
      start: "08:00",
      end: "17:00",
      days: ["lundi", "mardi", "mercredi", "jeudi", "vendredi"],
    },
  })

  private privacySettingsSignal = signal<PrivacySettings>({
    allowAnalytics: true,
    sharePerformance: false,
    keepHistory: true,
  })

  userProfile = this.userProfileSignal.asReadonly()
  notificationSettings = this.notificationSettingsSignal.asReadonly()
  userPreferences = this.userPreferencesSignal.asReadonly()
  enqueteSettings = this.enqueteSettingsSignal.asReadonly()
  privacySettings = this.privacySettingsSignal.asReadonly()

  updateProfile(profile: UserProfile): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.userProfileSignal.set(profile)
        resolve()
      }, 1000)
    })
  }

  changePassword(passwordData: PasswordChange): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate password validation
        if (passwordData.currentPassword === "wrongpassword") {
          reject(new Error("Mot de passe actuel incorrect"))
        } else {
          resolve()
        }
      }, 1000)
    })
  }

  updateNotificationSettings(settings: NotificationSettings): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.notificationSettingsSignal.set(settings)
        resolve()
      }, 500)
    })
  }

  updatePreferences(preferences: UserPreferences): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.userPreferencesSignal.set(preferences)
        resolve()
      }, 500)
    })
  }

  updateEnqueteSettings(settings: EnqueteSettings): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.enqueteSettingsSignal.set(settings)
        resolve()
      }, 500)
    })
  }

  updatePrivacySettings(settings: PrivacySettings): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.privacySettingsSignal.set(settings)
        resolve()
      }, 500)
    })
  }

  exportData(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate data export
        const data = {
          profile: this.userProfileSignal(),
          notifications: this.notificationSettingsSignal(),
          preferences: this.userPreferencesSignal(),
          enquetes: this.enqueteSettingsSignal(),
          privacy: this.privacySettingsSignal(),
        }
        console.log("Exported data:", data)
        resolve()
      }, 2000)
    })
  }

  deleteAccount(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Account deleted")
        resolve()
      }, 2000)
    })
  }

  submitSupportTicket(subject: string, message: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Support ticket submitted:", { subject, message })
        resolve()
      }, 1000)
    })
  }
}
