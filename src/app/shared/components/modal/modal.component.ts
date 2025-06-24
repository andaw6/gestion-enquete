import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() open: boolean = false;
  @Input() autoClose: boolean = true;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  closeModal() {
    if (this.autoClose)
      this.open = false;
    this.close.emit();
  }
}
