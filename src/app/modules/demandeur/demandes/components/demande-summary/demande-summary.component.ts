import { Component, Input } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';

@Component({
  selector: 'app-demande-summary',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './demande-summary.component.html',
  styleUrls: ['./demande-summary.component.css']
})
export class DemandeSummaryComponent {
  @Input() demande!: DemandeEnqueteModel;

  formatDate(date: Date | null): string {
    if (!date) return "Non définie"
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date))
  }

  getPriorityDots(): number[] {
    return [1, 2, 3, 4, 5]
  }

  getPrioriteLabel(priorite: number): string {
    const labels = ["Très faible", "Faible", "Normale", "Élevée", "Critique"]
    return labels[priorite - 1] || "Normale"
  }
}
