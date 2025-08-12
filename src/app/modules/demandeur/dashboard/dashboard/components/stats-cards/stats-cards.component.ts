import { Component, Input } from '@angular/core';
import { StatCard } from '@shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-stats-cards',
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css'],
})
export class StatsCardsComponent {
  @Input() statsData: StatCard[] = []

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
