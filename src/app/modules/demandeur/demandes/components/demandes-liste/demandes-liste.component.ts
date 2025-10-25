import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';
import { DemandeEnquete } from '@modules/demandeur/dashboard/dashboard';
import { LoaderComponent } from "@shared/components/loader/loader.component";
import { PRIORITE_LEVELS, PRIORITE_LEVELS_LABEL } from '@config/constant';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';


@Component({
  selector: 'app-demandes-liste',
  standalone: true,
  imports: [CommonModule, DatePipe, NgIf, NgForOf, LoaderComponent],
  templateUrl: './demandes-liste.component.html',
  styleUrls: ['./demandes-liste.component.css']
})
export class DemandesListeComponent {
  @Input() demandes: DemandeEnqueteModel[] = [];
  @Input() loading: boolean = false;
  @Output() voirDemande = new EventEmitter<DemandeEnqueteModel>();
  @Output() telechargerDemande = new EventEmitter<DemandeEnqueteModel>();

  constructor() { }


  getPrioriteClass(priorite: number): string {
    const prioriteMap: { [key: number]: string } = {
      1: 'bg-blue-100 text-blue-800',      // Basse
      2: 'bg-yellow-100 text-yellow-800',  // Moyenne
      3: 'bg-orange-100 text-orange-800',  // Haute
      4: 'bg-red-100 text-red-800',        // Très haute
      5: 'bg-purple-100 text-purple-800'   // Urgente
    };
    return prioriteMap[priorite] || 'bg-gray-100 text-gray-800';
  }

  getPrioriteLabel(priorite: number): string {
    return PRIORITE_LEVELS_LABEL[priorite] || 'Non définie';
  }

  getStatutClass(etatCode: string): string {
    const statutMap: { [key: string]: string } = {
      '00': 'bg-gray-400', // EN_ATTENTE
      '01': 'bg-blue-500', // EN_COURS
      '02': 'bg-green-600', // TERMINEE
      '03': 'bg-yellow-500', // EN_VALIDATION
      '04': 'bg-green-500', // VALIDEE
      '05': 'bg-purple-500', // EN_REVISION
      '06': 'bg-red-500' // ANNULEE
    };
    return statutMap[etatCode] || 'bg-gray-400';
  }

  isEcheanceDepassee(dateEcheance: Date|null): boolean {
    if(dateEcheance == null) return false;
    return new Date(dateEcheance) < new Date();
  }

  onVoir(demande: DemandeEnqueteModel): void {
    this.voirDemande.emit(demande);
  }

  onTelecharger(demande: DemandeEnqueteModel): void {
    this.telechargerDemande.emit(demande);
  }


  trackByDemande() {

  }

}
