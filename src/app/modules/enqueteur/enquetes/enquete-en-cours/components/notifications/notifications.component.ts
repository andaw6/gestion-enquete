import { Component } from '@angular/core';
import { AsyncPipe, CommonModule, NgForOf, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import {Notification, NotificationService} from "../enquete-details/enquete-details.component";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, AsyncPipe],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
notifications$: Observable<Notification[]>

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$
  }

  ngOnInit(): void {}

  getNotificationClass(type: string): string {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white"
      case "error":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white"
      case "warning":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
      case "info":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
    }
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id)
  }
}
