import { Component, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule, NgClass, NgIf } from "@angular/common";

export interface ConfirmationData {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf],
  templateUrl: './confirmation-modal.component.html',
  styleUrls:[ './confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Input() isVisible = false
  @Input() data: ConfirmationData = { title: "", message: "" }
  @Input() isLoading = false

  @Output() confirm = new EventEmitter<void>()
  @Output() cancel = new EventEmitter<void>()

  onConfirm() {
    this.confirm.emit()
  }

  onCancel() {
    this.cancel.emit()
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCancel()
    }
  }
}
