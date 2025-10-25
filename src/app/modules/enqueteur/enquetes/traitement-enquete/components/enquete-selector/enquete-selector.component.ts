import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnqueteModel } from '@core/model/enquete.model';

@Component({
  selector: 'app-enquete-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enquete-selector.component.html',
  styleUrls: ['./enquete-selector.component.css']
})
export class EnqueteSelectorComponent {
  @Input() enquetes: EnqueteModel[] = [];
  @Input() selectedEnqueteIds: number[] = [];
  @Output() enqueteToggle = new EventEmitter<{ enqueteId: number; checked: boolean }>();

  onEnqueteChange(event: Event, enqueteId: number): void {
    const checkbox = event.target as HTMLInputElement;
    this.enqueteToggle.emit({ enqueteId, checked: checkbox.checked });
  }

  getEtatColor(codeEtat: string): string {
    switch (codeEtat) {
      default: return "";
    }
  }
}
