import { Component, Input } from '@angular/core';
import { CommonModule, NgIf,NgClass } from '@angular/common';
import { DemandeEnqueteModel } from "@core/model/demande-enquete.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-demande-details',
  standalone: true,
  imports: [CommonModule, NgIf,NgClass],
  templateUrl: './demande-details.component.html',
  styleUrls: ['./demande-details.component.css']
})
export class DemandeDetailsComponent {
  @Input() demande!: DemandeEnqueteModel;

  constructor(
    private router:Router,
  ){}

  formatDate(date: Date | null): string {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("fr-FR")
  }

  getPriorityLabel(priorite: number): string {
    switch (priorite) {
      case 1:
        return "Très faible (1/5)"
      case 2:
        return "Faible (2/5)"
      case 3:
        return "Moyenne (3/5)"
      case 4:
        return "Élevée (4/5)"
      case 5:
        return "Très élevée (5/5)"
      default:
        return `Priorité ${priorite}`
    }
  }

  showDemande(){
    this.router.navigate(["/demandeur/demandes/detail", this.demande.id]).then(_=> _);
  }
}
