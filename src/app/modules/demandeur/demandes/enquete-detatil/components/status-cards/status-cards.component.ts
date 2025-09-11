import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnqueteModel } from '@core/model/enquete.model';

@Component({
  selector: 'app-status-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-cards.component.html',
  styleUrls: ['./status-cards.component.css']
})
export class StatusCardsComponent {
  @Input() enquete!: EnqueteModel

  formatDate(date: Date | null): string {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("fr-FR")
  }

  getStatusDuration(): string {
    if (!this.enquete?.dateDebut) return "N/A"
    const start = new Date(this.enquete.dateDebut)
    const now = new Date()
    const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return `Actif depuis ${days} jours`
  }

  getProgressStep(): string {
    const progress = this.enquete?.progression || 0
    if (progress < 20) return "Étape 1 sur 5"
    if (progress < 40) return "Étape 2 sur 5"
    if (progress < 60) return "Étape 3 sur 5"
    if (progress < 80) return "Étape 4 sur 5"
    return "Étape 5 sur 5"
  }

  getRemainingDays(): string {
    if (!this.enquete?.dateFin) return "N/A"
    const end = new Date(this.enquete.dateFin)
    const now = new Date()
    const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} jours restants` : "Échéance dépassée"
  }
}
