import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notification } from '../../../notification';
import { Observable, of } from 'rxjs';
import { Pagination } from '@core/interfaces/pagination.interface';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css'],
})
export class NotificationListComponent {
  @Input() notifications: Observable<Notification[]>  = of([]);
  @Input() selectedNotifications = new Set<number>()
  @Input() pagination!: Pagination;
  @Output() openModal = new EventEmitter<Notification>()
  @Output() toggleSelection = new EventEmitter<number>()
  @Output() markAsRead = new EventEmitter<number>()
  @Output() deleteNotification = new EventEmitter<number>();
  @Output() paginationChange = new EventEmitter<Pagination>();

  constructor(private sanitizer: DomSanitizer) {}

  getNotificationClass(notification: Notification): string {
    notification.typeNotification = notification.typeNotification.toUpperCase()
    if (notification.typeNotification === "ALERTE") {
      return "border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-red-100 "
    } else if (notification.typeNotification === "ENQUETE") {
      return "border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 "
    } else if (notification.typeNotification === "DOCUMENT") {
      return "border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100"
    } else if (notification.typeNotification === "SYSTEME") {
      return "border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-green-100 "
    } else if (!notification.lu) {
      return "border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 "
    } else {
      return "border-l-4 border-gray-300 "
    }
  }

  getIconClass(notification: Notification): string {
    notification.typeNotification = notification.typeNotification.toUpperCase()
    if (notification.typeNotification === "ALERTE") {
      return "bg-red-100 text-red-600 "
    } else if (notification.typeNotification === "ENQUETE") {
      return "bg-blue-100  text-blue-600 "
    } else if (notification.typeNotification === "DOCUMENT") {
      return "bg-orange-100  text-orange-600 "
    } else if (notification.typeNotification === "SYSTEME") {
      return "bg-green-100  text-green-600 "
    } else {
      return "bg-gray-100  text-gray-600 "
    }
  }

  getTypeBadgeClass(notification: Notification): string {
    notification.typeNotification = notification.typeNotification.toUpperCase()
    if (notification.typeNotification === "ALERTE") {
      return "bg-red-100 text-red-800"
    } else if (notification.typeNotification === "ENQUETE") {
      return "bg-blue-100 text-blue-800"
    } else if (notification.typeNotification === "DOCUMENT") {
      return "bg-orange-100 text-orange-800"
    } else if (notification.typeNotification === "SYSTEME") {
      return "bg-green-100 text-green-800"
    } else {
      return "bg-gray-100 text-gray-800"
    }
  }

  getNotificationIcon(type: string): SafeHtml {
    const icon = this.getIconSvgByType(type);
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
  getIconSvgByType(type: string): string {
    type = type.toUpperCase();
    const icons = {
      ENQUETE:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>',
      DOCUMENT:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',
      SYSTEME:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>',
      RAPPEL:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      ALERTE:
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>',
    }
    return icons[type as keyof typeof icons] || icons.SYSTEME
  }

  getTypeLabel(type: string): string {
    const labels = {
      ENQUETE: "Enquête",
      DOCUMENT: "Document",
      SYSTEME: "Système",
      RAPPEL: "Rappel",
      ALERTE: "Alerte",
    }
    return labels[type as keyof typeof labels] || type
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return `Aujourd'hui à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === 2) {
      return `Hier à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays <= 7) {
      return `Il y a ${diffDays - 1} jours`
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }
}
