import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgIf } from '@angular/common';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';
import { formatInitial } from '@core/util/function/initial-formatter.util';

@Component({
  selector: 'app-demande-sidebar',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf, DatePipe],
  templateUrl: './demande-sidebar.component.html',
  styleUrls: ['./demande-sidebar.component.css']
})
export class DemandeSidebarComponent {

  @Input() demande!: DemandeEnqueteModel

  getStatutClass(code: string): string {
    switch (code) {
      case "00": // En attente
        return "bg-yellow-100 text-yellow-800";
      case "01": // Valider
        return "bg-green-100 text-green-800";
      case "02": // Rejeter
        return "bg-red-100 text-red-800";
      case "03": // En complément
        return "bg-blue-100 text-blue-800";
      case "04": // Annuler
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }


  isEcheanceProche(): boolean {
    if (!this.demande.dateEcheance) return false
    const today = new Date()
    const echeance = new Date(this.demande.dateEcheance)
    const diffTime = echeance.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }


  getInitiales = formatInitial;
}
