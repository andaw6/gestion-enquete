import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { ListSourceCardComponent } from "@modules/enqueteur/traitement/source-info/components/list-source-card/list-source-card.component";
import { SourceInfoModel } from '@core/model/source-info.model';

@Component({
  selector: 'app-existing-source-list',
  standalone: true,
  imports: [CommonModule, ListSourceCardComponent, NgForOf, NgIf],
  templateUrl: './existing-source-list.component.html',
  styleUrls: ['./existing-source-list.component.css']
})
export class ExistingSourceListComponent {
  @Input() sources: SourceInfoModel[] = [];
  @Input() selectedSourceId: number | null = null;
  @Output() back = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();
  @Output() sourceSelect = new EventEmitter<number>();

  onSourceSelect(sourceId: number): void {
    this.selectedSourceId = sourceId;
    this.sourceSelect.emit(sourceId);
  }
}
