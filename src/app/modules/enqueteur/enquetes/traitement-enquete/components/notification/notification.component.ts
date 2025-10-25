import { Component, inject } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { NotificationService } from '../../test';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  private notificationService = inject(NotificationService)

  notifications = this.notificationService.getNotifications()

  trackByNotification(index: number, notification: any) {
    return notification.id
  }

  remove(id: string) {
    // this.notificationService.remove(id)
  }
}
