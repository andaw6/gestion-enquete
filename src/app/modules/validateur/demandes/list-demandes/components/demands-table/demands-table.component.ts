import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { DemandeEnqueteModel, DemandeEnqueteStatEtat, DemandeEtatDemande } from '@core/model/demande-enquete.model';
import { Pagination } from '@core/interfaces/pagination.interface';
import { CodeLibelle } from '@core/model/code-libelle.model';


@Component({
  selector: 'app-demands-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './demands-table.component.html',
  styleUrls: ['./demands-table.component.css']
})
export class DemandsTableComponent {
  @Input() demandes: DemandeEnqueteModel[] = []
  @Input() pagination!: Pagination;
  @Output() viewDetails = new EventEmitter<DemandeEnqueteModel>()
  @Output() approve = new EventEmitter<{ demande: DemandeEnqueteModel, commentaire: string }>();
  @Output() reject = new EventEmitter<{ demande: DemandeEnqueteModel, commentaire: string }>();
  @Output() pageChange = new EventEmitter<Pagination>()

  getUserInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  canValidate(etat: CodeLibelle) {
    return etat.code == DemandeEtatDemande.EnAttente || etat.code == DemandeEtatDemande.EnComplement;
  }

  getConcerneLabel(type: string): string {
    const labels: { [key: string]: string } = {
      employeur: "Employeur",
      travailleur: "Travailleur",
      beneficiaire: "Bénéficiaire",
    }
    return labels[type] || type
  }

  getTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      employeur: "bg-blue-50 text-blue-700 border-blue-200",
      travailleur: "bg-emerald-50 text-emerald-700 border-emerald-200",
      beneficiaire: "bg-amber-50 text-amber-700 border-amber-200",
    }
    return classes[type] || ""
  }

  getStatusClass(code: string): string {
    const classes: Record<string, string> = {
      [DemandeEtatDemande.EnAttente]: "bg-yellow-50 text-yellow-700 border-yellow-200",
      [DemandeEtatDemande.Valider]: "bg-green-50 text-green-700 border-green-200",
      [DemandeEtatDemande.Rejeter]: "bg-red-50 text-red-700 border-red-200",
      [DemandeEtatDemande.EnComplement]: "bg-blue-50 text-blue-700 border-blue-200",
      [DemandeEtatDemande.Annuler]: "bg-gray-100 text-gray-600 border-gray-300",
    };
    return classes[code] || "bg-gray-50 text-gray-700 border-gray-200";
  }

  getStatusIndicatorClass(code: string): string {
    const classes: Record<string, string> = {
      [DemandeEtatDemande.EnAttente]: "bg-yellow-500 animate-pulse",
      [DemandeEtatDemande.Valider]: "bg-green-500",
      [DemandeEtatDemande.Rejeter]: "bg-red-500",
      [DemandeEtatDemande.EnComplement]: "bg-blue-500 animate-pulse",
      [DemandeEtatDemande.Annuler]: "bg-gray-400",
    };
    return classes[code] || "bg-gray-300";
  }

  onApprove(demande: DemandeEnqueteModel) {
    this.approve.emit({ demande, commentaire: "" });
  }
  onReject(demande: DemandeEnqueteModel) { 
    this.reject.emit({ demande, commentaire: "" });

  }


}
