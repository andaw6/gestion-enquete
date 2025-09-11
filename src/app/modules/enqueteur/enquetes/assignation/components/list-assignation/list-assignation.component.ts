import { Component, Input } from '@angular/core';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { EnqueteModel } from '@core/model/enquete.model';
import { ConcerneModel, TypeConcerne } from '@core/model/concerne.model';

@Component({
  selector: 'app-list-assignation',
  standalone: true,
  imports: [CommonModule, NgClass, NgForOf],
  templateUrl: './list-assignation.component.html',
  styleUrls: ['./list-assignation.component.css']
})
export class ListAssignationComponent {
  @Input() assignations: EnqueteModel[] = [];

  demandeEnquete(enquete: EnqueteModel) { }

  getPrioriteClass(priorite: number): string {
    switch (priorite) {
      case 1:
      case 2:
        return "bg-red-100 text-red-700"
      case 3:
        return "bg-yellow-100 text-yellow-700"
      case 4:
      case 5:
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }


  getIcon(enquete: EnqueteModel): string {
    switch (enquete.demande!.concerne.type) {
      case "beneficiaire":
        return "fas fa-users";
      case "employeur":
        return "fas fa-building";
      case "travailleur":
        return "fas fa-user";
      default:
        return "fas fa-file";
    }
  }

  getGradient(enquete: EnqueteModel): string {
    switch (enquete.demande!.concerne.type) {
      case "beneficiaire":
        return "bg-gradient-to-br from-indigo-400 to-indigo-600";
      case "employeur":
        return "bg-gradient-to-br from-blue-400 to-blue-600";
      case "travailleur":
        return "bg-gradient-to-br from-green-400 to-green-600";
      default:
        return "";
    }
  }

  getTypeLabel(type: TypeConcerne): string {

    switch (type) {
      case "beneficiaire":
        return "Bénéficiaire";
      case "employeur":
        return "Employeur";
      case "travailleur":
        return "Traivailleur";
      default:
        return "Autre";
    }
  }

  getTitle(concerne: ConcerneModel): string {
    return `Enquête ${this.getTypeLabel(concerne.type)} - ${concerne.regionSocial} - ${concerne.telephone}`;
  }
}
