import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface StatCard {
  title: string
  value: string | number
  subtitle: string
  icon: string
  bgColor: string
  iconColor: string
  trend?: string
  trendType?: "positive" | "negative"
}

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent {
  @Input() statCards: StatCard[] = [
    {
      title: "Enquêtes Totales",
      value: 24,
      subtitle: "12% ce mois",
      icon: "file-icon",
      bgColor: "text-secondary-600",
      iconColor: "gradient-secondary",
      trend: "+12% ce mois",
      trendType: "positive",
    },
    {
      title: "En Cours",
      value: 8,
      subtitle: "33% du total",
      icon: "lightning-icon",
      bgColor: "text-yellow-600",
      iconColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
      trend: undefined,
    },
    {
      title: "Terminées",
      value: 14,
      subtitle: "58% du total",
      icon: "check-icon",
      bgColor: "text-green-600",
      iconColor: "bg-gradient-to-br from-green-400 to-green-600",
      trend: undefined,
    },
    {
      title: "Taux Moyen",
      value: "68%",
      subtitle: "+5% cette semaine",
      icon: "chart-icon",
      bgColor: "text-primary-600",
      iconColor: "gradient-primary",
      trend: "+5% cette semaine",
      trendType: "positive",
    },
  ]

  getTrendClass(type: "positive" | "negative" | undefined): string {
    return type === "positive" ? "text-green-600" : "text-gray-500"
  }
}
