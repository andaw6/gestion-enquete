import { Component, Input } from '@angular/core';
// import { Activity } from '@modules/chef-enqueteur/dashboard/dashboard';
export interface ActivityAction {
  type: 'primary' | 'secondary';
  label: string;
  icon: string;
  callback?: () => void;
}

export interface Activity {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  isNew?: boolean;
  status?: 'completed' | 'pending' | 'error' | 'in-progress';
  tags?: string[];
  timestamp?: Date | string;
  priority?: 'high' | 'medium' | 'low';
  progress?: number;
  actions?: ActivityAction[];
}



@Component({
  selector: 'app-recent-activities',
  templateUrl: './recent-activities.component.html',
  styleUrls: ['./recent-activities.component.css']
})
export class RecentActivitiesComponent {

  last: boolean = false;
  // @Input() activities: Activity[] = [
  //   {
  //     id: 1,
  //     title: 'Enquête ENQ-2024-001 validée',
  //     subtitle: 'Par Marie Dubois • Il y a 2h',
  //     icon: 'fas fa-check',
  //     iconBg: 'bg-green-100',
  //     iconColor: 'text-green-600'
  //   },
  //   {
  //     id: 2,
  //     title: 'Nouvelle assignation ENQ-2024-015',
  //     subtitle: 'À Jean Martin • Il y a 3h',
  //     icon: 'fas fa-user-plus',
  //     iconBg: 'bg-blue-100',
  //     iconColor: 'text-blue-600'
  //   },
  //   {
  //     id: 3,
  //     title: 'Enquête urgente reçue',
  //     subtitle: 'DEM-2024-089 • Il y a 5h',
  //     icon: 'fas fa-exclamation-triangle',
  //     iconBg: 'bg-orange-100',
  //     iconColor: 'text-orange-600'
  //   }
  // ];


  @Input() activities: Activity[] = [
    {
      id: 1,
      title: 'Enquête ENQ-2024-001 validée',
      subtitle: 'Par Marie Dubois • Il y a 2h',
      icon: 'fas fa-check',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      isNew: true,
      status: 'completed',
      tags: ['Urgent', 'Priorité Haute'],
      timestamp: new Date(),
      priority: 'high',
      progress: 100,
      actions: [
        { type: 'primary', label: 'Voir', icon: 'fas fa-eye' },
        { type: 'secondary', label: 'Archiver', icon: 'fas fa-archive' }
      ]
    },
    {
      id: 2,
      title: 'Nouvelle assignation ENQ-2024-015',
      subtitle: 'À Jean Martin • Il y a 3h',
      icon: 'fas fa-user-plus',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      status: 'in-progress',
      timestamp: new Date(),
      priority: 'medium',
      progress: 60
    },
    {
      id: 3,
      title: 'Enquête urgente reçue',
      subtitle: 'DEM-2024-089 • Il y a 5h',
      icon: 'fas fa-exclamation-triangle',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      status: 'pending',
      timestamp: new Date(),
      priority: 'low'
    }
  ];

  getTodayCount(): number {
    const today = new Date().toDateString();
    return this.activities.filter(a => new Date(a.timestamp || '').toDateString() === today).length;
  }

  getWeekCount(): number {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return this.activities.filter(a => {
      const ts = new Date(a.timestamp || '');
      return ts >= weekStart;
    }).length;
  }

  getLastUpdate(): Date {
    if (!this.activities.length) return new Date();
    return new Date(Math.max(...this.activities.map(a => new Date(a.timestamp || '').getTime())));
  }

  getRelativeTime(date?: Date | string): string {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours} h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days} j`;
  }

  trackByActivity(index: number, activity: Activity): number {
    return activity.id;
  }

  onActivityClick(activity: Activity) {
    console.log('Activity clicked:', activity);
  }

  onActionClick(event: Event, action: ActivityAction) {
    event.stopPropagation();
    console.log('Action clicked:', action);
    if (action.callback) action.callback();
  }
}
