import { Component } from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';

interface QuickAction {
  label: string
  icon: string
  gradient: string
  count?: number
}


@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, NgForOf, NgClass, NgIf],
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.css']
})
export class QuickActionsComponent {
  quickActions: QuickAction[] = [
    {
      label: "Voir Assignations",
      icon: "fas fa-inbox",
      gradient: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      count: 5,
    },
    {
      label: "Continuer Enquête",
      icon: "fas fa-play",
      gradient: "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-glow",
    },
    {
      label: "Soumettre Rapport",
      icon: "fas fa-file-upload",
      gradient: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700",
    },
    {
      label: "Mon Planning",
      icon: "fas fa-calendar-check",
      gradient: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700",
    },
  ]

  handleAction(actionLabel: string): void {
    console.log("Action clicked:", actionLabel)
    // Implement action logic based on actionLabel
  }
}
