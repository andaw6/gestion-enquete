import { Component, Input } from '@angular/core';
import { ActivityItem } from '@modules/demandeur/dashboard/dashboard';

@Component({
  selector: 'app-recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.css']
})
export class RecentActivityComponent {
  @Input() activities: ActivityItem[] = []

  getActivityIconClass(type: string): string {
    const baseClass = "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
    switch (type) {
      case "success":
        return `${baseClass} bg-green-100`
      case "warning":
        return `${baseClass} bg-yellow-100`
      case "error":
        return `${baseClass} bg-red-100`
      default:
        return `${baseClass} bg-blue-100`
    }
  }

  getActivityIconColor(type: string): string {
    switch (type) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }
}
