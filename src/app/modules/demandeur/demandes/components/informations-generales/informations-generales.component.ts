import { Component, Input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';

@Component({
  selector: 'app-informations-generales',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './informations-generales.component.html',
  styleUrls: ['./informations-generales.component.css']
})
export class InformationsGeneralesComponent {
  @Input() demande!: DemandeEnqueteModel

  getPrioriteClass(priorite: number): string {
    switch (priorite) {
      case 1:
      case 2:
        return "bg-green-100 text-green-800"
      case 3:
        return "bg-yellow-100 text-yellow-800"
      case 4:
      case 5:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getPrioriteLabel(priorite: number): string {
    const labels = ["", "Très faible (1/5)", "Faible (2/5)", "Moyenne (3/5)", "Élevée (4/5)", "Critique (5/5)"]
    return labels[priorite] || "Non définie"
  }

  formatDate(): string {
    const echeance = this.demande.dateEcheance;

    if (!echeance) {
      return "Pas de date d'échéance";
    }

    // Si c'est une string, on convertit en Date
    const date = typeof echeance === 'string' ? new Date(echeance) : echeance;

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

    isEcheanceProche(): boolean {
    const dateEcheance = this.demande?.dateEcheance;
    if (!dateEcheance) return false
    const today = new Date()
    const echeance = new Date(dateEcheance)
    const diffTime = echeance.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }


}
