import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demande-quick-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demande-quick-actions.component.html',
  styleUrls: ['./demande-quick-actions.component.css']
})
export class DemandeQuickActionsComponent {
  @Output() action = new EventEmitter<string>()

  onAction(actionType: string) {
    this.action.emit(actionType)
  }
}
