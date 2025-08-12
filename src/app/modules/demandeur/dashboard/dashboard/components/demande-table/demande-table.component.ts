import { CommonModule, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UtilService } from '@core/services/util.service';
import { DemandeEnquete } from '@modules/demandeur/dashboard/dashboard';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-demande-table',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf, NgForOf, DatePipe, LoaderComponent],
  templateUrl: './demande-table.component.html',
  styleUrls: ['./demande-table.component.css']
})
export class DemandeTableComponent {

  @Input() demandes: DemandeEnquete[] = [];
  @Input() loading: boolean = false;

  constructor(
    private readonly utilService: UtilService,
  ) { }

  getRequestIconClass(statusCode: string): string {
    const baseClass = "w-8 h-8 rounded-lg flex items-center justify-center mr-3";

    switch (statusCode) {
      case "01": // validée
        return `${baseClass} bg-green-100`;
      case "00": // en attente
        return `${baseClass} bg-yellow-100`;
      case "03": // en complément
        return `${baseClass} bg-purple-100`;
      case "02": // annulée
        return `${baseClass} bg-red-100`;
      default:
        return `${baseClass} bg-blue-100`;
    }
  }

  getStatusIcon(statusCode: string): string {
    switch (statusCode) {
      case "01": // Validée
        return "fas fa-check-circle";      // ✔️
      case "00": // En attente
        return "fas fa-hourglass-half";    // ⌛
      case "03": // En complément
        return "fas fa-info-circle";       // ℹ️
      case "02": // Annulée
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
      case "01": // validée
        return "text-green-600";
      case "00": // en attente
        return "text-yellow-600";
      case "03": // en complément
        return "text-purple-600";
      case "02": // annulée
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  }


  getStatusClass(statusCode: string): string {
    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    switch (statusCode) {
      case "01": // validée
        return `${baseClass} bg-green-100 text-green-800`;
      case "00": // en attente
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case "03": // en complément
        return `${baseClass} bg-purple-100 text-purple-800`;
      case "02": // annulée
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getStatusDotClass(statusCode: string): string {
    const baseClass = "w-1.5 h-1.5 rounded-full mr-2";

    switch (statusCode) {
      case "00": // En attente
        return `${baseClass} bg-yellow-400`;
      case "01": // Validée
        return `${baseClass} bg-green-400`;
      case "02": // Annulée
        return `${baseClass} bg-red-400`;
      case "03": // En complément
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




  viewRequest(request: DemandeEnquete): void {
    console.log("Voir la demande:", request)
  }

  downloadRequest(request: DemandeEnquete): void {
    console.log("Télécharger/Éditer la demande:", request)
  }
}
