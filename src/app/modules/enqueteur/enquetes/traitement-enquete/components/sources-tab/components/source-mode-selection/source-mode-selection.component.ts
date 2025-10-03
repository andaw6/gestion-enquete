import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SourceMode = 'select' | 'create';
@Component({
  selector: 'app-source-mode-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './source-mode-selection.component.html',
  styleUrls: ['./source-mode-selection.component.css']
})
export class SourceModeSelectionComponent {
  @Output() modeSelected = new EventEmitter<SourceMode>();
}
