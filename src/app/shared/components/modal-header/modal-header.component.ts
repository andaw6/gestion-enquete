import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.css']
})
export class ModalHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() iconClass = 'fas fa-file';
  @Output() close = new EventEmitter<void>();
}
