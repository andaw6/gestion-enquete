import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { EnqueteEtatEnquete, EnqueteModel } from '@core/model/enquete.model';
import { Logger } from '@core/services/logger.service';
import { tempsEcouleDetaille } from '@core/util/function/date-formatter.util';
import { UtilService } from '@core/services/util.service';


@Component({
  selector: 'app-enquete-list',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './enquete-list.component.html',
  styleUrls: ['./enquete-list.component.css']
})
export class EnqueteListComponent {
  @Input() enquetes: EnqueteModel[] = [];

  @Output() enqueteClick = new EventEmitter<EnqueteModel>()

  readonly utilService = inject(UtilService);


  onEnqueteClick(enquete: EnqueteModel): void {
    this.enqueteClick.emit(enquete)
  }

  tempsEcoule = tempsEcouleDetaille;

  getPriorityClass(priorite: number) {
    switch (priorite) {
      case 4:
      case 5:
        return "border-l-green-500 to-green-50"
      case 3:
        return "border-l-yellow-500 to-yellow-50";
      case 1:
      case 2:
        return "border-l-red-500 to-red-50";
      default:
        return "border-l-gray-500 to-gray-50";
    }
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case EnqueteEtatEnquete.EnAttente: // 00
        return "bg-yellow-100 text-yellow-800";
      case EnqueteEtatEnquete.EnCours: // 01
        return "bg-blue-100 text-blue-800";
      case EnqueteEtatEnquete.Terminee: // 02
        return "bg-green-100 text-green-800";
      case EnqueteEtatEnquete.EnValidation: // 03
        return "bg-purple-100 text-purple-800";
      case EnqueteEtatEnquete.Validee: // 04
        return "bg-emerald-100 text-emerald-800";
      case EnqueteEtatEnquete.EnRevision: // 05
        return "bg-orange-100 text-orange-800";
      case EnqueteEtatEnquete.Annulee: // 06
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }




  getPriorityBadgeClass(priorite: number): string {
    switch (priorite) {
      case 1:
      case 2:
        return "bg-red-100 text-red-800"
      case 3:
        return "bg-yellow-100 text-yellow-800"
      case 4:
      case 5:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }


  getProgressColor(progression: number): string {
    if (progression >= 80) return "text-green-600"
    if (progression >= 50) return "text-yellow-600"
    return "text-blue-600"
  }

  getProgressBgColor(progression: number): string {
    if (progression >= 80) return "bg-gradient-to-r from-green-500 to-green-600"
    if (progression >= 50) return "bg-gradient-to-r from-yellow-500 to-yellow-600"
    return "bg-gradient-to-r from-blue-500 to-blue-600"
  }



  formatDateTime(dateString: string | Date | null): string {
    if (typeof dateString != "string") return "";
    const date = new Date(dateString)
    return `${date.toLocaleDateString("fr-FR")} ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
  }

  formatDate(date: Date | null): string {
    if (!date) return ""
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date))
  }

  getPriorityLabel(priorite: number) {
    return this.utilService.getPrioriteLabel(priorite);
  }

}
