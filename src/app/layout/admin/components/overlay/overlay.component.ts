import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css'],
  standalone: true,
})
export class OverlayComponent {
  @Input() isActive = false
  @Output() overlayClick = new EventEmitter<void>()

  onOverlayClick(): void {
    this.overlayClick.emit()
  }
}
