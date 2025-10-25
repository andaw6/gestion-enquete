import { Component } from '@angular/core';
import { CommonModule, NgClass, NgForOf } from '@angular/common';

interface Notification {
  id: number
  title: string
  description: string
  icon: string
  gradient: string
  bgColor: string
  borderColor: string
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, NgForOf, NgClass],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  notifications: Notification[] = [
    {
      id: 1,
      title: "Nouvelle assignation",
      description: "SARL InnovTech - Priorité haute",
      icon: "fas fa-exclamation-circle",
      gradient: "bg-gradient-to-br from-orange-400 to-orange-600",
      bgColor: "bg-gradient-to-r from-orange-50 to-orange-100/50",
      borderColor: "border-orange-200",
    },
    {
      id: 2,
      title: "Échéance proche",
      description: "Enquête TechCorp dans 3 jours",
      icon: "fas fa-clock",
      gradient: "bg-gradient-to-br from-red-400 to-red-600",
      bgColor: "bg-gradient-to-r from-red-50 to-red-100/50",
      borderColor: "border-red-200",
    },
    {
      id: 3,
      title: "Rappel",
      description: "Mettre à jour le rapport Dupont",
      icon: "fas fa-info-circle",
      gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
      bgColor: "bg-gradient-to-r from-blue-50 to-blue-100/50",
      borderColor: "border-blue-200",
    },
  ]
}
