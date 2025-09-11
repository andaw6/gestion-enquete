import { Component, Input } from '@angular/core';
import { CommonModule, NgClass, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnqueteModel } from '@core/model/enquete.model';
import { TypeConcerne } from '@core/model/concerne.model';

@Component({
  selector: 'app-historique-enquete',
  standalone: true,
  imports: [CommonModule, NgClass, NgForOf, FormsModule],
  templateUrl: './historique-enquete.component.html',
  styleUrls: ['./historique-enquete.component.css']
})
export class HistoriqueEnqueteComponent {
  @Input() enquetes: EnqueteModel[] = [];

  selectedStatus: string = "";


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


  voirEnquete(enquete: EnqueteModel) {

  }

  continuerEnquete(enquete: EnqueteModel) {

  }

  filterByStatus() { }


  getTypeColor(type: TypeConcerne): string {
    switch (type) {
      case "beneficiaire":
        return "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800";
      case "employeur":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800";
      case "travailleur":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800";
      default:
        return "";
    }
  }

  getStatusColor(code: string): string {
    return "";
  }


  getProgressColor(progession: number): string {
    return "";
  }
}
