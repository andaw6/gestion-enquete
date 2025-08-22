import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';

@Component({
  selector: 'app-demande-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demande-timeline.component.html',
  styleUrls: ['./demande-timeline.component.css']
})
export class DemandeTimelineComponent {
  @Input() demande!: DemandeEnqueteModel

  formatDate(date: Date | null): string {
    if (!date) return ""
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date))
  }

  formatDateTime(date: Date | null): string {
    if (!date) return ""
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }
}
