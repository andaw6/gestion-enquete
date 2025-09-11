import { Component, Input } from '@angular/core';
import { CommonModule, NgClass, NgForOf } from '@angular/common';
import { EnqueteModel } from '@core/model/enquete.model';
import { ConcerneModel, TypeConcerne } from '@core/model/concerne.model';

@Component({
  selector: 'app-enquete-en-cours',
  standalone: true,
  imports: [CommonModule, NgClass, NgForOf],
  templateUrl: './enquete-en-cours.component.html',
  styleUrls: ['./enquete-en-cours.component.css']
})
export class EnqueteEnCoursComponent {
  @Input() enquetes: EnqueteModel[] = [];

  getActionButtonClass(progress: number): string {
    if (progress >= 90) {
      return "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
    }
    return "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
  }

  getActionButtonText(progress: number): string {
    return progress >= 90 ? "Finaliser" : "Continuer"
  }

  getIcon(type: TypeConcerne): string {
    switch (type) {
      case "beneficiaire":
        return "";
      case "employeur":
        return "fas fa-building";
      case "travailleur":
        return "fas fa-user";
      default:
        return "fas fa-file";
    }
  }

  getGradient(type: TypeConcerne): string {
    switch (type) {
      case "beneficiaire":
        return "";
      case "employeur":
        return "bg-gradient-to-br from-blue-400 to-blue-600";
      case "travailleur":
        return "bg-gradient-to-br from-green-400 to-green-600";
      default:
        return "";
    }
  }

  getBgColor(type: TypeConcerne): string {

    switch (type) {
      case "beneficiaire":
        return "";
      case "employeur":
        return "bg-gradient-to-br from-blue-400 to-blue-600";
      case "travailleur":
        return "bg-gradient-to-br from-green-400 to-green-600";
      default:
        return "";
    }
  }

  handleSurveyAction(id: number, progress: number): void {
    if (progress >= 90) {
      console.log("Finalizing survey:", id)
    } else {
      console.log("Continuing survey:", id)
    }
  }

  voirEnquete(enquete: EnqueteModel): void {

  }

  getProgressColor(progession: number): string {
    return "";
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
