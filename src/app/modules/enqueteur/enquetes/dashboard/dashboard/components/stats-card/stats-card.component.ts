import {Component, Input} from '@angular/core';
import {StatCard} from "@modules/enqueteur/enquetes/dashboard/dashboard";

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent {
  @Input() stat!: StatCard

  Math = Math

  getBackgroundColor(): string {
    const colorMap: { [key: string]: string } = {
      "text-blue-600": "bg-blue-100",
      "text-green-600": "bg-green-100",
      "text-yellow-600": "bg-yellow-100",
      "text-red-600": "bg-red-100",
    }
    return colorMap[this.stat.iconColor] || "bg-gray-100"
  }

  getChangeColor(): string {
    switch (this.stat.changeType) {
      case "increase":
        return "text-green-600"
      case "decrease":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  getChangeIcon(): string {
    switch (this.stat.changeType) {
      case "increase":
        return "fas fa-arrow-up"
      case "decrease":
        return "fas fa-arrow-down"
      default:
        return "fas fa-equals"
    }
  }

  getChangeText(): string {
    switch (this.stat.changeType) {
      case "increase":
        return "Augmentation"
      case "decrease":
        return "Diminution"
      default:
        return "Stable"
    }
  }
}
