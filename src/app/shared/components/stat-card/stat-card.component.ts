import { Component, Input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

export interface StatCard {
  title: string
  value: string | number
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: string
  gradient: string
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {
  @Input() stat!: StatCard;

  getChangeClass(changeType: string): string {
    switch (changeType) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  getChangeIcon(changeType: string): string {
    switch (changeType) {
      case "positive":
        return "fas fa-arrow-up"
      case "negative":
        return "fas fa-arrow-down"
      default:
        return "fas fa-clock"
    }
  }
}
