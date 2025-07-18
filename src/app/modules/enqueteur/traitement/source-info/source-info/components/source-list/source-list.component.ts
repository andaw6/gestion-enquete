import {Component, EventEmitter, Input, Output, TrackByFunction} from '@angular/core';
import {SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";

@Component({
  selector: 'app-source-list',
  templateUrl: './source-list.component.html',
  styleUrls: ['./source-list.component.css']
})
export class SourceListComponent {

  @Input() sources: SourceInfo[] = [];
  @Output() onActionClick: EventEmitter<SourceInfo> = new EventEmitter<SourceInfo>();
  @Output() onUpdatedClick: EventEmitter<SourceInfo> = new EventEmitter<SourceInfo>();
  @Input() selected: number|null = null;


  getStars(source: SourceInfo): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < Number(source.niveauFiabilite))
  }

  getUsageText(source: SourceInfo): string {
    return `${"Utilisée"} ${'N'} fois`
  }
}
