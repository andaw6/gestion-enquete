import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { CommonModule, NgSwitch, NgSwitchCase } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface EnqueteDisplay {
  id: string
  titre: string
  type: string
  priorite: "Urgent" | "Importante" | "Normale"
  statut: string
  progression: number
  assignee: string
  organisation: string
  dateCreation: string
  dateEcheance: string
  description: string
  documents: number
  notes: number
  tempsEcoule: string
  derniereActivite: string
  tags: string[]
}

export interface Notification {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([])
  notifications$ = this.notificationsSubject.asObservable()

  showNotification(message: string, type: "success" | "error" | "warning" | "info" = "info", duration = 3000): void {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      duration,
    }

    const currentNotifications = this.notificationsSubject.value
    this.notificationsSubject.next([...currentNotifications, notification])

    setTimeout(() => {
      this.removeNotification(notification.id)
    }, duration)
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value
    this.notificationsSubject.next(currentNotifications.filter((n) => n.id !== id))
  }
}


@Component({
  selector: 'app-enquete-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enquete-details.component.html',
  styleUrls: ['./enquete-details.component.css']
})
export class EnqueteDetailsComponent {

  @Input() enquete: EnqueteDisplay | null = null
  @Output() back = new EventEmitter<void>()

  activeTab = "timeline"

  tabs = [
    { id: "timeline", label: "Timeline", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    {
      id: "documents",
      label: `Documents (${this.enquete?.documents || 0})`,
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      id: "notes",
      label: `Notes (${this.enquete?.notes || 0})`,
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    },
    {
      id: "team",
      label: "Équipe",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      id: "analysis",
      label: "Analyse",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
  ]

  constructor(private notificationService: NotificationService) { }

  onBack(): void {
    this.back.emit()
  }

  getPriorityBadgeClass(priorite: string): string {
    switch (priorite) {
      case "Urgent":
        return "bg-red-100 text-red-800"
      case "Importante":
        return "bg-yellow-100 text-yellow-800"
      case "Normale":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  updateStatus(): void {
    this.notificationService.showNotification("Statut de l'enquête mis à jour", "success")
  }

  addNote(): void {
    this.notificationService.showNotification("Note ajoutée avec succès", "success")
  }

  uploadDocument(): void {
    this.notificationService.showNotification("Document téléchargé avec succès", "success")
  }

  sendMessage(): void {
    this.notificationService.showNotification("Message envoyé avec succès", "success")
  }

  generateReport(): void {
    this.notificationService.showNotification("Génération du rapport en cours...", "info")
    setTimeout(() => {
      this.notificationService.showNotification("Rapport généré avec succès", "success")
    }, 2000)
  }

  getTimelineContent(): string {
    return `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-900">Timeline de l'enquête</h3>
        </div>
        
        <div class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div class="space-y-6">
            <div class="relative flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center relative z-10">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div class="flex-1 bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-gray-900">Note d'investigation ajoutée</h4>
                  <span class="text-xs text-gray-500">Aujourd'hui 14:30</span>
                </div>
                <p class="text-sm text-gray-600 mb-2">Entretien avec le témoin principal programmé pour demain. Éléments importants à vérifier concernant les transactions suspectes.</p>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <span class="font-medium">Jean Dupont</span>
                  <span>•</span>
                  <span>Note d'enquête</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  getDocumentsContent(): string {
    return `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-900">Documents de l'enquête</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-gray-900 truncate">Rapport d'expertise comptable</h4>
                <p class="text-xs text-gray-500 mt-1">PDF • 2.4 MB</p>
                <p class="text-xs text-gray-500">Ajouté il y a 1 jour</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  getNotesContent(): string {
    return `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-900">Notes d'enquête</h3>
        </div>
        
        <div class="space-y-4">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-semibold text-blue-600">JD</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Jean Dupont</h4>
                  <p class="text-xs text-gray-500">Aujourd'hui 14:30</p>
                </div>
              </div>
              <span class="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Urgent</span>
            </div>
            <h5 class="font-semibold text-gray-900 mb-2">Entretien témoin principal</h5>
            <p class="text-gray-600 text-sm">
              Entretien programmé avec M. Martin (témoin principal) pour demain 10h00. Points à aborder :
              <br>- Circonstances de la découverte des irrégularités
              <br>- Personnes ayant accès aux comptes concernés
              <br>- Procédures de validation en place
            </p>
          </div>
        </div>
      </div>
    `
  }

  getTeamContent(): string {
    return `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-900">Équipe de l'enquête</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-lg font-bold text-blue-600">JD</span>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900">Jean Dupont</h4>
                <p class="text-sm text-gray-600">Enquêteur Principal</p>
                <p class="text-xs text-gray-500">jean.dupont@justice.gouv.fr</p>
              </div>
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Responsable</span>
            </div>
          </div>
        </div>
      </div>
    `
  }

  getAnalysisContent(): string {
    return `
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-900">Analyse de l'enquête</h3>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Éléments clés</h4>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span class="text-xs font-bold text-red-600">!</span>
                </div>
                <div>
                  <h5 class="font-semibold text-gray-900">Montant concerné</h5>
                  <p class="text-sm text-gray-600">150 000€ de transactions suspectes identifiées</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}
