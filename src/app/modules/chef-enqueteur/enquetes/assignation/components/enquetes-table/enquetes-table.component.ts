import { Pagination } from '@core/interfaces/pagination.interface';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe, NgForOf } from '@angular/common';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';

@Component({
  selector: 'app-enquetes-table',
  standalone: true,
  imports: [CommonModule, NgForOf, DatePipe],
  templateUrl: './enquetes-table.component.html',
  styleUrls: ['./enquetes-table.component.css']
})
export class EnquetesTableComponent {
  @Input() enquetes: DemandeEnqueteModel[] = []
  @Input() currentPage = 1
  @Input() totalPages = 1
  @Input() totalItems = 0
  @Input() itemsPerPage = 10

  pagination: Pagination = {
    page: 1,
    totalPage: 1,
    totalItem: 3,
    limit: 10
  }

  @Output() assignEnquete = new EventEmitter<DemandeEnqueteModel>()
  @Output() viewDetails = new EventEmitter<DemandeEnqueteModel>()
  @Output() pageChange = new EventEmitter<number>()

  onAssign(enquete: DemandeEnqueteModel) {
    this.assignEnquete.emit(enquete)
  }

  onViewDetails(enquete: DemandeEnqueteModel) {
    this.viewDetails.emit(enquete)
  }

  onPageChange(page: number) {
    this.pageChange.emit(page)
  }

  trackByEnquete(index: number, enquete: DemandeEnqueteModel): number {
    return enquete.id
  }

  getPrioriteClass(priorite: number): string {
    switch (priorite) {
      case 4:
        return "bg-red-100 text-red-800" // Urgente
      case 3:
        return "bg-orange-100 text-orange-800" // Haute
      case 2:
        return "bg-blue-100 text-blue-800" // Normale
      case 1:
        return "bg-gray-100 text-gray-800" // Basse
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getPrioriteLabel(priorite: number): string {
    switch (priorite) {
      case 4:
        return "Urgente"
      case 3:
        return "Haute"
      case 2:
        return "Normale"
      case 1:
        return "Basse"
      default:
        return "Non définie"
    }
  }

  getTypeClass(type: string): string {
    switch (type.toLowerCase()) {
      case "fraude":
        return "bg-purple-100 text-purple-800"
      case "vol":
        return "bg-red-100 text-red-800"
      case "corruption":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  getIconClass(type: string): string {
    switch (type.toLowerCase()) {
      case "fraude":
        return "fas fa-exclamation-triangle text-red-600"
      case "vol":
        return "fas fa-shield-alt text-orange-600"
      case "corruption":
        return "fas fa-handshake text-blue-600"
      default:
        return "fas fa-file-alt text-gray-600"
    }
  }

  getUrgentCount() {
    return 1;
  }

  getNormalCount() {
    return 1;
  }

  getLowCount() {
    return 2;
  }
}
