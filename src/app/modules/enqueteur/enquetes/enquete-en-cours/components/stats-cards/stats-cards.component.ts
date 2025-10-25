import { Component, Input } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';

export interface StatCard {
  title: string
  value: string | number
  icon: string
  colorClass: string
}


@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent {
  @Input() stats: StatCard[] = []

  getIconBgClass(colorClass: string): string {
    if (colorClass.includes("blue")) return "bg-gradient-to-br from-blue-500 to-blue-600"
    if (colorClass.includes("red")) return "bg-gradient-to-br from-red-500 to-red-600"
    if (colorClass.includes("yellow")) return "bg-gradient-to-br from-yellow-500 to-yellow-600"
    if (colorClass.includes("green")) return "bg-gradient-to-br from-green-500 to-green-600"
    return "bg-gradient-to-br from-blue-500 to-blue-600"
  }
}
