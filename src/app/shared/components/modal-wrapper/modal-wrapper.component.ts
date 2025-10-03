import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.css']
})
export class ModalWrapperComponent {
  @Input() isOpen = false;
  @Input() modalClass = 'w-full max-w-4xl max-h-[90vh]';
  @Output() closeModal = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal.emit();
    }
  }
}
