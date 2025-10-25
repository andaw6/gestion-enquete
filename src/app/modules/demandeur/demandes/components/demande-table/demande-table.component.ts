import { CommonModule, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DemandeEnqueteModel, DemandeEtatDemande } from '@core/model/demande-enquete.model';
import { UtilService } from '@core/services/util.service';
import { ActionMode } from '@core/types';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-demande-table',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf, NgForOf, DatePipe, LoaderComponent],
  templateUrl: './demande-table.component.html',
  styleUrls: ['./demande-table.component.css']
})
export class DemandeTableComponent {

  @Input() demandes: DemandeEnqueteModel[] = [];
  @Input() loading: boolean = false;
  @Output() action = new EventEmitter<{ action: ActionMode, demande: DemandeEnqueteModel }>();

  constructor(
    private readonly utilService: UtilService,
  ) { }

  getRequestIconClass(statusCode: string): string {
    const baseClass = "w-8 h-8 rounded-lg flex items-center justify-center mr-3";

    switch (statusCode) {
      case DemandeEtatDemande.Valider: // validée
        return `${baseClass} bg-green-100`;
      case DemandeEtatDemande.EnAttente: // en attente
        return `${baseClass} bg-yellow-100`;
      case DemandeEtatDemande.EnComplement: // en complément
        return `${baseClass} bg-purple-100`;
      case DemandeEtatDemande.Annuler: // annulée
        return `${baseClass} bg-red-100`;
      default:
        return `${baseClass} bg-blue-100`;
    }
  }

  getStatusIcon(statusCode: string): string {
    switch (statusCode) {
      case DemandeEtatDemande.Valider: // Validée
        return "fas fa-check-circle";      // ✔️
      case DemandeEtatDemande.EnAttente: // En attente
        return "fas fa-hourglass-half";    // ⌛
      case DemandeEtatDemande.EnComplement: // En complément
        return "fas fa-info-circle";       // ℹ️
      case DemandeEtatDemande.Annuler: // Annulée
        return "fas fa-times-circle";      // ❌
      default:
        return "fas fa-question-circle";   // ❓
    }
  }

  getPriorityLabel(priorite: number) {
    return this.utilService.getPrioriteLabel(priorite);
  }


  getRequestIconColor(statusCode: string): string {
    switch (statusCode) {
      case DemandeEtatDemande.Valider: // validée
        return "text-green-600";
      case DemandeEtatDemande.EnAttente: // en attente
        return "text-yellow-600";
      case DemandeEtatDemande.EnComplement: // en complément
        return "text-purple-600";
      case DemandeEtatDemande.Annuler: // annulée
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  }


  getStatusClass(statusCode: string): string {
    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    switch (statusCode) {
      case DemandeEtatDemande.Valider: // validée
        return `${baseClass} bg-green-100 text-green-800`;
      case DemandeEtatDemande.EnAttente: // en attente
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case DemandeEtatDemande.EnComplement: // en complément
        return `${baseClass} bg-purple-100 text-purple-800`;
      case DemandeEtatDemande.Annuler: // annulée
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getStatusDotClass(statusCode: string): string {
    const baseClass = "w-1.5 h-1.5 rounded-full mr-2";

    switch (statusCode) {
      case DemandeEtatDemande.EnAttente: // En attente
        return `${baseClass} bg-yellow-400`;
      case DemandeEtatDemande.Valider: // Validée
        return `${baseClass} bg-green-400`;
      case DemandeEtatDemande.Annuler: // Annulée
        return `${baseClass} bg-red-400`;
      case DemandeEtatDemande.EnComplement: // En complément
        return `${baseClass} bg-blue-400`;
      default: // Code inconnu
        return `${baseClass} bg-gray-400`;
    }
  }



  getPriorityClass(priority: number): string {
    const baseClass = "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium";

    switch (priority) {
      case 1: // Très haute
      case 2: // Haute
        return `${baseClass} bg-red-100 text-red-800`;
      case 3: // Moyenne
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 4: // Faible
      case 5: // Très faible
        return `${baseClass} bg-green-100 text-green-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`; // fallback si priorité inconnue
    }
  }


  viewRequest(request: DemandeEnqueteModel): void {
    this.action.emit({
      demande: request,
      action: "view"
    });
  }

  downloadRequest(request: DemandeEnqueteModel): void {
    this.action.emit({
      demande: request,
      action: request.etat.code == DemandeEtatDemande.Valider ? "download" : "update"
    });
  }
}
