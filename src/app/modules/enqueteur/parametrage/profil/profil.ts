export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  address: string
  avatar?: string
}

export interface PasswordChange {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface NotificationSettings {
  enquetes: {
    newAssignments: { email: boolean; sms: boolean; push: boolean }
    deadlines: { email: boolean; sms: boolean; push: boolean }
    comments: { email: boolean; sms: boolean; push: boolean }
  }
  system: {
    security: { email: boolean }
    maintenance: { email: boolean; push: boolean }
  }
}

export interface UserPreferences {
  theme: "auto" | "light" | "dark"
  language: string
  timezone: string
  dateFormat: string
  timeFormat: "12" | "24"
  itemsPerPage: number
}

export interface EnqueteSettings {
  preferredTypes: string[]
  maxWorkload: number
  responseDelay: number
  autoAcceptLowPriority: boolean
  acceptOutsideHours: boolean
  workingHours: {
    start: string
    end: string
    days: string[]
  }
}

export interface PrivacySettings {
  allowAnalytics: boolean
  sharePerformance: boolean
  keepHistory: boolean
}

export type SettingsTab = "profile" | "account" | "notifications" | "preferences" | "enquetes" | "privacy" | "support"
