import { Pagination } from '@core/interfaces/pagination.interface';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe, NgForOf } from '@angular/common';
import { DemandeEnqueteModel, DemandeEtatDemande } from '@core/model/demande-enquete.model';
import { EnqueteEtatEnquete } from '@core/model/enquete.model';
import { CodeLibelle } from '@core/model/code-libelle.model';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";

@Component({
  selector: 'app-enquetes-table',
  standalone: true,
  imports: [CommonModule, NgForOf, DatePipe, PaginationComponent],
  templateUrl: './enquetes-table.component.html',
  styleUrls: ['./enquetes-table.component.css']
})
export class EnquetesTableComponent {
  @Input() enquetes: DemandeEnqueteModel[] = []
  @Input() pagination!: Pagination;

  @Output() assignEnquete = new EventEmitter<DemandeEnqueteModel>()
  @Output() viewDetails = new EventEmitter<DemandeEnqueteModel>()
  @Output() pageChange = new EventEmitter<Pagination>()

  onAssign(enquete: DemandeEnqueteModel) {
    this.assignEnquete.emit(enquete)
  }

  onViewDetails(enquete: DemandeEnqueteModel) {
    this.viewDetails.emit(enquete)
  }


  trackByEnquete(index: number, enquete: DemandeEnqueteModel): number {
    return enquete.id
  }

  getPrioriteClass(priorite: number): string {
    switch (priorite) {
      case 5:
        return "bg-red-200 text-red-900"; // Critique
      case 4:
        return "bg-red-100 text-red-800"; // Urgente
      case 3:
        return "bg-orange-100 text-orange-800"; // Haute
      case 2:
        return "bg-blue-100 text-blue-800"; // Normale
      case 1:
        return "bg-gray-100 text-gray-800"; // Basse
      default:
        return "bg-gray-100 text-gray-800"; // Non définie
    }
  }

  getPrioriteLabel(priorite: number): string {
    switch (priorite) {
      case 5:
        return "Critique";
      case 4:
        return "Urgente";
      case 3:
        return "Haute";
      case 2:
        return "Normale";
      case 1:
        return "Basse";
      default:
        return "Non définie";
    }
  }



  getEtatClass(etat: CodeLibelle): string {
    switch (etat.code) {
      case DemandeEtatDemande.EnAttente:
        return "bg-gray-100 text-gray-800";
      case DemandeEtatDemande.Valider:
        return "bg-green-100 text-green-800";
      case DemandeEtatDemande.Rejeter:
        return "bg-red-100 text-red-800";
      case DemandeEtatDemande.EnComplement:
        return "bg-yellow-100 text-yellow-800";
      case DemandeEtatDemande.Annuler:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  getIconClass(etat: CodeLibelle): string {
    switch (etat.code) {
      case DemandeEtatDemande.EnAttente:
        return "fas fa-hourglass-start text-gray-500";
      case DemandeEtatDemande.Valider:
        return "fas fa-check-circle text-green-600";
      case DemandeEtatDemande.Rejeter:
        return "fas fa-times-circle text-red-600";
      case DemandeEtatDemande.EnComplement:
        return "fas fa-edit text-yellow-600";
      case DemandeEtatDemande.Annuler:
        return "fas fa-ban text-orange-600";
      default:
        return "fas fa-file-alt text-gray-600";
    }
  }

  getUrgentCount() {
    return 1;
  }

  getNormalCount() {
    return 1;
  }

  getLowCount() {
    return 2;
  }
}
