import { Component, Input, OnInit } from '@angular/core';
import { DashbordService } from "@modules/enqueteur/enquetes/dashboard/dashbord.service";
import { Enquete } from "@modules/enqueteur/enquetes/dashboard/dashboard";
import { Observable } from "rxjs";
import { EnqueteModel } from '@core/model/enquete.model';
import { PRIORITE_LEVELS_LABEL } from '@config/constant';
import { TypeConcerne } from '@core/model/concerne.model';

@Component({
  selector: 'app-recent-enquetes',
  templateUrl: './recent-enquetes.component.html',
  styleUrls: ['./recent-enquetes.component.css']
})
export class RecentEnquetesComponent implements OnInit {
  enquetes$!: Observable<Enquete[]>

  @Input() enqueteRecentes: EnqueteModel[] = [];

  constructor(private enqueteService: DashbordService) { }

  ngOnInit(): void {
    this.enquetes$ = this.enqueteService.enquetes$
  }


  getStatusClass(statusCode: string): string {
    const baseClass = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    switch (statusCode) {
      case "00": // En attente
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case "01": // En cours
        return `${baseClass} bg-blue-100 text-blue-800`;
      case "02": // Terminée
        return `${baseClass} bg-green-100 text-green-800`;
      case "03": // En validation
        return `${baseClass} bg-purple-100 text-purple-800`;
      case "04": // Validée
        return `${baseClass} bg-teal-100 text-teal-800`;
      case "05": // En révision
        return `${baseClass} bg-orange-100 text-orange-800`;
      case "06": // Annulée
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getTypeConcerneClass(type: TypeConcerne): string {
    const baseClass = "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium";

    switch (type) {
      case "employeur":
        return `${baseClass} bg-indigo-100 text-indigo-800`;
      case "beneficiaire":
        return `${baseClass} bg-pink-100 text-pink-800`;
      case "travailleur":
        return `${baseClass} bg-cyan-100 text-cyan-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }


  getPrioriteClass(priority: number): string {
    const baseClass = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

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


  // getPrioriteClass(priorite: number): string {
  //   const baseClass = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";

  //   switch (priorite) {
  //     case 1:
  //       return `${baseClass} bg-red-100 text-red-800`;      // Très élevée
  //     case 2:
  //       return `${baseClass} bg-orange-100 text-orange-800`; // Élevée
  //     case 3:
  //       return `${baseClass} bg-gray-100 text-gray-800`;    // Normale
  //     case 4:
  //       return `${baseClass} bg-green-100 text-green-800`;  // Faible
  //     case 5:
  //       return `${baseClass} bg-teal-100 text-teal-800`;    // Très faible
  //     default:
  //       return baseClass;
  //   }
  // }

  getPrioriteLabel(priorite: number): string {
    return PRIORITE_LEVELS_LABEL[priorite] ?? "Inconnu";
  }
}
