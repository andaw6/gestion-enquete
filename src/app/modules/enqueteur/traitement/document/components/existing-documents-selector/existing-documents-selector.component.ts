import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentModel } from '@core/model/document.model';
import { UtilService } from '@core/services/util.service';

@Component({
  selector: 'app-existing-documents-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './existing-documents-selector.component.html',
  styleUrls: ['./existing-documents-selector.component.css']
})
export class ExistingDocumentsSelectorComponent {
  @Input() documents: DocumentModel[] = [];
  @Input() selectedDocIds: number[] = [];
  @Output() documentToggle = new EventEmitter<{ docId: number; checked: boolean }>();

  constructor(protected utilService: UtilService) { }

  onDocChange(event: Event, docId: number): void {
    const checkbox = event.target as HTMLInputElement;
    this.documentToggle.emit({ docId, checked: checkbox.checked });
  }
}
