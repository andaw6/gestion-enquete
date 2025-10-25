import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { EnqueteurModel } from '@core/model/enqueteur.model';
import { AssignmentData } from '@modules/chef-enqueteur/enquetes/model';
import { FormsModule } from '@angular/forms';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';

@Component({
  selector: 'app-assign-modal',
  standalone: true,
  imports: [CommonModule,FormsModule, NgIf, NgForOf],
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
      alert("Veuillez sélectionner un enquêteur")
      return
    }

    this.assign.emit(this.assignmentData)
  }

  getPrioriteClass(priorite: number): string {
    switch (priorite) {
      case 4:
        return "bg-red-100 text-red-800"
      case 3:
        return "bg-orange-100 text-orange-800"
      case 2:
        return "bg-blue-100 text-blue-800"
      case 1:
        return "bg-gray-100 text-gray-800"
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

  getEnqueteurStatus(enqueteur: EnqueteurModel): string {
    if (enqueteur.disponible) {
      return "Disponible"
    } else {
      return `${enqueteur.enquetesEnCours} enquête(s) en cours`
    }
  }
}
