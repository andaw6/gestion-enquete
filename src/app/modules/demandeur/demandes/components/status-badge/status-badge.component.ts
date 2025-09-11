import { Component, Input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { DemandeEtatDemande } from '@core/model/demande-enquete.model';
import { CodeLibelle } from '@core/model/code-libelle.model';


export interface StatusConfig {
  bgColor: string;
  textColor: string;
  icon: string;
}


@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
  @Input() etat!: CodeLibelle;

  private statusConfigs: Map<string, StatusConfig> = new Map([
    [DemandeEtatDemande.EnAttente, {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: 'fas fa-clock'
    }],
    [DemandeEtatDemande.Valider, {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: 'fas fa-check-circle'
    }],
    [DemandeEtatDemande.Rejeter, {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: 'fas fa-times-circle'
    }],
    [DemandeEtatDemande.EnComplement, {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: 'fas fa-info-circle'
    }],
    [DemandeEtatDemande.Annuler, {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      icon: 'fas fa-ban'
    }]
  ]);

  getStatusClasses(): string {
    const config = this.statusConfigs.get(this.etat.code);
    if (config) {
      return `${config.bgColor} ${config.textColor}`;
    }
    // Valeurs par défaut si l'état n'est pas trouvé
    return 'bg-gray-100 text-gray-800';
  }

  getStatusIcon(): string {
    const config = this.statusConfigs.get(this.etat.code);
    return config?.icon || 'fas fa-question-circle';
  }
}
