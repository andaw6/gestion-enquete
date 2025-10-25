import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { QuickAction } from '@modules/chef-enqueteur/dashboard/dashboard';

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.css'],
  standalone: true,
  imports:[CommonModule, NgForOf, NgIf, NgClass]
})
export class QuickActionsComponent {

  quickActions: QuickAction[] = [
    {
      id: 1,
      title: 'Assigner Enquête',
      icon: 'fas fa-plus',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      action: 'assign'
    },
    {
      id: 2,
      title: 'Valider Conclusions',
      icon: 'fas fa-check',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      action: 'validate'
    },
    {
      id: 3,
      title: 'Générer Rapport',
      icon: 'fas fa-chart-line',
      bgColor: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      action: 'report'
    },
    {
      id: 4,
      title: 'Gérer Équipe',
      icon: 'fas fa-users',
      bgColor: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      action: 'team'
    }
  ];

  executeAction(action: string): void {
    switch (action) {
      case 'assign':
        console.log('Assigner une enquête');
        break;
      case 'validate':
        console.log('Valider des conclusions');
        break;
      case 'report':
        console.log('Générer un rapport');
        break;
      case 'team':
        console.log('Gérer l\'équipe');
        break;
    }
  }
}
