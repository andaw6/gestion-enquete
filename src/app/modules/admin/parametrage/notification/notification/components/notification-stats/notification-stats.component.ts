import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NotificationStats } from '../../../notification';

@Component({
  selector: 'app-notification-stats',
  templateUrl: './notification-stats.component.html',
  styleUrls: ['./notification-stats.component.css'],
})
export class NotificationStatsComponent {
  @Input() stats: NotificationStats = {
    total: 0,
    unread: 0,
    read: 0,
    urgent: 0,
  }
}
