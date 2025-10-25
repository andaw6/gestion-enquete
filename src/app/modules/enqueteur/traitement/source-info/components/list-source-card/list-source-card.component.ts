import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceInfoModel } from "@core/model/source-info.model"
import { UtilService } from '@core/services/util.service';


@Component({
  selector: 'app-list-source-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-source-card.component.html',
  styleUrls: ['./list-source-card.component.css']
})
export class ListSourceCardComponent {
  @Input() source!: SourceInfoModel;
  @Input() isSelected = false;
  @Output() sourceSelected = new EventEmitter<number>();

  constructor(protected utilService: UtilService) { }

  getEtatClass(etat: string): string {
    switch (this.source.etat.code) {
      case '00': return 'bg-gray-100 text-gray-800';          // En attente de validation
      case '01': return 'bg-green-100 text-green-800';        // Actif
      case '02': return 'bg-slate-100 text-slate-800';        // Inactif
      case '03': return 'bg-yellow-100 text-yellow-800';      // Archivée
      case '04': return 'bg-red-100 text-red-800';            // Invalide / Non fiable
      default: return 'bg-slate-200 text-slate-700';
    }
  }

  getTypeIcon(type: string): string {
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


}
