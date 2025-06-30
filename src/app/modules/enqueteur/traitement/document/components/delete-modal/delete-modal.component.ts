import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {
  @Input() isOpen: boolean = false;
  @Input() itemName: string = 'cet élément';
  @Input() isDeleting: boolean = false; // Nouvel input pour l'état de chargement

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isClosing: boolean = false;

  // Fermer la modal avec la touche Échap
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen && !this.isDeleting) {
      this.onCancel();
    }
  }

  // Empêcher la fermeture pendant le chargement
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.isOpen && this.isDeleting) {
      // Empêcher toute action clavier pendant la suppression
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onConfirm(): void {
    if (!this.isDeleting) {
      this.confirm.emit();
    }
  }

  onCancel(): void {
    if (!this.isDeleting) {
      this.isClosing = true;
      // Délai pour l'animation de fermeture
      setTimeout(() => {
        this.isClosing = false;
        this.cancel.emit();
      }, 300);
    }
  }

  // Méthode pour ouvrir la modal avec animation
  open(): void {
    this.isOpen = true;
  }

  // Méthode pour fermer la modal avec animation
  close(): void {
    this.onCancel();
  }
}
