import {Component, OnInit} from '@angular/core';
import {DashbordService} from "@modules/enqueteur/enquetes/dashboard/dashbord.service";
import {Enquete} from "@modules/enqueteur/enquetes/dashboard/dashboard";
import {Observable} from "rxjs";

@Component({
  selector: 'app-recent-enquetes',
  templateUrl: './recent-enquetes.component.html',
  styleUrls: ['./recent-enquetes.component.css']
})
export class RecentEnquetesComponent implements OnInit {
  enquetes$!: Observable<Enquete[]>

  constructor(private enqueteService: DashbordService) {}

  ngOnInit(): void {
    this.enquetes$ = this.enqueteService.enquetes$
  }

  getStatutClass(statut: string): string {
    const baseClass = "inline-flex px-2 py-1 text-xs font-semibold rounded-full"
    switch (statut) {
      case "En cours":
        return `${baseClass} bg-green-100 text-green-800`
      case "Planifiée":
        return `${baseClass} bg-blue-100 text-blue-800`
      case "En attente":
        return `${baseClass} bg-yellow-100 text-yellow-800`
      case "Terminée":
        return `${baseClass} bg-gray-100 text-gray-800`
      default:
        return baseClass
    }
  }

  getPrioriteClass(priorite: string): string {
    const baseClass = "inline-flex px-2 py-1 text-xs font-semibold rounded-full"
    switch (priorite) {
      case "Haute":
        return `${baseClass} bg-red-100 text-red-800`
      case "Normale":
        return `${baseClass} bg-gray-100 text-gray-800`
      case "Basse":
        return `${baseClass} bg-green-100 text-green-800`
      default:
        return baseClass
    }
  }
}
