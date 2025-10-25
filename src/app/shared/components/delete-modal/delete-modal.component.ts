import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DeleteModelInfo {
  title: string,
  subtitle: string,
  message: string
}

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {
  @Input() showModal = false
  @Input() info: DeleteModelInfo = {
    title: "Supprimer le service",
    subtitle: "Cette action est irréversible",
    message: "Êtes-vous sûr de vouloir supprimer ce service ? Toutes les données associées seront perdues définitivement."
  }
  @Output() confirm = new EventEmitter<void>()
  @Output() cancel = new EventEmitter<void>()

  onConfirm(): void {
    this.confirm.emit()
  }

  onCancel(): void {
    this.cancel.emit()
  }

  // Close modal when clicking outside
  onClickOutside(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === "deleteModalOverlay") {
      this.onCancel()
    }
  }
}
