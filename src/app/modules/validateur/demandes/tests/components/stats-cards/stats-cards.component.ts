import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatsData {
  enAttente: number;
  approuvees: number;
  rejetees: number;
  total: number;
  aujourdhui: number;
  semaine: number;
  mois: number;
}

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent {
  @Input() stats: StatsData = {
    enAttente: 0,
    approuvees: 0,
    rejetees: 0,
    total: 0,
    aujourdhui: 0,
    semaine: 0,
    mois: 0
  };

  getRejectionRate(): number {
    if (this.stats.total === 0) return 0;
    return Math.round((this.stats.rejetees / this.stats.total) * 100);
  }
}
