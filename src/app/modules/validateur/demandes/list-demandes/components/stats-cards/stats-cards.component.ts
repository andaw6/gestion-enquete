import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatsData {
  pending: number
  approved: number
  rejected: number
  total: number
}

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent {
  @Input() stats: StatsData = { pending: 0, approved: 0, rejected: 0, total: 0 }

  get rejectionRate(): number {
    return this.stats.total > 0 ? Math.round((this.stats.rejected / this.stats.total) * 100) : 0
  }
}
