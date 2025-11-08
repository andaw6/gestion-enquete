import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { EnqueteurModel } from '@core/model/enqueteur.model';
import { AssignmentData } from '@modules/chef-enqueteur/enquetes/model';
import { FormsModule } from '@angular/forms';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';

@Component({
  selector: 'app-assign-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgForOf],
  templateUrl: './assign-modal.component.html',
  styleUrls: ['./assign-modal.component.css']
})
export class AssignModalComponent {
  @Input() isOpen = false
  @Input() enquete: DemandeEnqueteModel | null = null
  @Input() enqueteurs: EnqueteurModel[] = []

  @Output() close = new EventEmitter<void>()
  @Output() assign = new EventEmitter<AssignmentData>()

  assignmentData: AssignmentData = {
    enqueteurId: 0,
    dateLimite: "",
    instructions: "",
  }

  ngOnChanges() {
    if (this.isOpen && this.enquete) {
      // Reset form when modal opens
      this.assignmentData = {
        enqueteurId: 0,
        dateLimite: "",
        instructions: "",
      }
    }
  }

  onClose() {
    this.close.emit()
  }

  onAssign() {
    if (!this.assignmentData.enqueteurId) {
      alert("Veuillez sélectionner un enquêteur");
      return;
    }

    if (this.assignmentData.dateLimite) {
      const dateStr = this.assignmentData.dateLimite;
      const dateWithTime = new Date(dateStr);
      if (dateWithTime.getHours() === 0 && dateWithTime.getMinutes() === 0) {
        dateWithTime.setHours(23, 59, 59, 0);
      }
      // Convertir en ISO (ex: 2025-11-08T23:59:59.000Z)
      this.assignmentData.dateLimite = dateWithTime.toISOString();
    }

    this.assign.emit(this.assignmentData);
  }

  getPrioriteClass(priorite: number): string {
    switch (priorite) {
      case 5:
        return "bg-red-200 text-red-900"; // Critique
      case 4:
        return "bg-red-100 text-red-800"; // Urgente
      case 3:
        return "bg-orange-100 text-orange-800"; // Haute
      case 2:
        return "bg-blue-100 text-blue-800"; // Normale
      case 1:
        return "bg-gray-100 text-gray-800"; // Basse
      default:
        return "bg-gray-100 text-gray-800"; // Non définie
    }
  }

  getPrioriteLabel(priorite: number): string {
    switch (priorite) {
      case 5:
        return "Critique";
      case 4:
        return "Urgente";
      case 3:
        return "Haute";
      case 2:
        return "Normale";
      case 1:
        return "Basse";
      default:
        return "Non définie";
    }
  }

  getEnqueteurStatus(enqueteur: EnqueteurModel): string {
    if (enqueteur.disponible) {
      return "Disponible"
    } else {
      return `${enqueteur.enquetesEnCours} enquête(s) en cours`
    }
  }
}
