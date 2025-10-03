import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PopupConfig {
  isVisible: boolean;
  details?: string;
  showArchiveButton?: boolean;
}

@Component({
  selector: 'app-delete-error-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-error-popup.component.html',
  styleUrls: ['./delete-error-popup.component.css']
})
export class DeleteErrorPopupComponent {
  @Input() config: PopupConfig = {
    isVisible: false,
    showArchiveButton: false,
  };

  @Output() close = new EventEmitter<void>();
  @Output() archive = new EventEmitter<void>(); // Événement pour archiver le document

  onClose() {
    this.close.emit();
  }

  onArchive() {
    this.archive.emit();
  }

  onBackdropClick(event: MouseEvent) {
    // Fermer le popup si on clique sur le backdrop
    this.onClose();
  }
}
