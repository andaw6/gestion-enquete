import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { SourceInfoModel } from "@core/model/source-info.model"

@Component({
  selector: 'app-source-card',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf],
  templateUrl: './source-card.component.html',
  styleUrls: ['./source-card.component.css']
})
export class SourceCardComponent {
  @Input() source!: SourceInfoModel
  @Output() edit = new EventEmitter<SourceInfoModel>()
  @Output() details = new EventEmitter<SourceInfoModel>()
  @Output() clickCard = new EventEmitter<SourceInfoModel>()

  fiabiliteMax = 5;
  fiabiliteMin = 1;


  // Détermination de la couleur du bord
  getBorderClass(): string {
    switch (this.source.type.code) {
      case 'TEMOIN': return 'border-l-green-500';
      case 'DOCUMENT': return 'border-l-amber-500';
      case 'OBSERVATION': return 'border-l-indigo-500';
      case 'NUMERIQUE': return 'border-l-pink-500';
      case 'INTERNE': return 'border-l-cyan-500';
      case 'EXTERNE': return 'border-l-teal-500';
      default: return 'border-l-slate-300';
    }
  }

  // Détermination du fond de l’icône
  getIconBgClass(): string {
    switch (this.source.type.code) {
      case 'TEMOIN': return 'bg-gradient-to-br from-green-500 to-green-600';
      case 'DOCUMENT': return 'bg-gradient-to-br from-amber-500 to-amber-600';
      case 'OBSERVATION': return 'bg-gradient-to-br from-indigo-500 to-indigo-600';
      case 'NUMERIQUE': return 'bg-gradient-to-br from-pink-500 to-pink-600';
      case 'INTERNE': return 'bg-gradient-to-br from-cyan-500 to-cyan-600';
      case 'EXTERNE': return 'bg-gradient-to-br from-teal-500 to-teal-600';
      default: return 'bg-slate-400';
    }
  }

  // Icônes fontawesome par type
  getIconClass(): string {
    switch (this.source.type.code) {
      case 'TEMOIN': return 'fa-solid fa-user';
      case 'DOCUMENT': return 'fa-solid fa-file';
      case 'OBSERVATION': return 'fa-solid fa-binoculars';
      case 'NUMERIQUE': return 'fa-solid fa-globe';
      case 'INTERNE': return 'fa-solid fa-building';
      case 'EXTERNE': return 'fa-solid fa-paper-plane';
      default: return 'fa-solid fa-circle-info';
    }
  }
  // Etat badge
  getEtatClass(): string {
    switch (this.source.etat.code) {
      case '00': return 'bg-gray-100 text-gray-800';          // En attente de validation
      case '01': return 'bg-green-100 text-green-800';        // Actif
      case '02': return 'bg-slate-100 text-slate-800';        // Inactif
      case '03': return 'bg-yellow-100 text-yellow-800';      // Archivée
      case '04': return 'bg-red-100 text-red-800';            // Invalide / Non fiable
      default: return 'bg-slate-200 text-slate-700';
    }
  }



  // Retourne la classe CSS selon la fiabilité (1 à 5)
  getFiabiliteClass(): string {
    if (!this.source || this.source.fiabilite == null) {
      return 'bg-slate-200'; // valeur indéfinie
    }

    const fiabilite = this.source.fiabilite;

    if (fiabilite >= 4) {
      return 'bg-gradient-to-r from-green-500 to-green-600'; // fiabilité élevée
    } else if (fiabilite >= 3) {
      return 'bg-gradient-to-r from-amber-500 to-amber-600'; // fiabilité moyenne
    } else {
      return 'bg-gradient-to-r from-red-500 to-red-600'; // fiabilité faible
    }
  }

  // Largeur de la barre de fiabilité proportionnelle (1 à 5)
  getFiabiliteBarWidth(): string {
    if (!this.source || this.source.fiabilite == null) {
      return '0';
    }

    const clamped = Math.min(Math.max(this.source.fiabilite, this.fiabiliteMin), this.fiabiliteMax);
    const percent = ((clamped - this.fiabiliteMin) / (this.fiabiliteMax - this.fiabiliteMin)) * 100;
    return `${percent}`;
  }


  formatDate(date: Date | null): string {
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
  }

  onEdit(e: Event) {
    e.stopPropagation()
    this.edit.emit(this.source)
  }

  onDetails(e: Event) {
    e.stopPropagation()
    this.details.emit(this.source)
  }
}
