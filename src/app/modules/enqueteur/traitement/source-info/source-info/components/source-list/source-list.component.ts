import {Component, EventEmitter, Input, Output, TrackByFunction} from '@angular/core';
import { SourceInfoModel } from '@core/model/source-info.model';

@Component({
  selector: 'app-source-list',
  templateUrl: './source-list.component.html',
  styleUrls: ['./source-list.component.css']
})
export class SourceListComponent {

  @Input() sources: SourceInfoModel[] = [];
  @Output() onActionClick = new EventEmitter<SourceInfoModel>();
  @Output() onUpdatedClick = new EventEmitter<SourceInfoModel>();
  @Input() selected: number|null = null;


  getStars(source: SourceInfoModel): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < Number(source.fiabilite))
  }

  getUsageText(source: SourceInfoModel): string {
    return `${"Utilisée"} ${'N'} fois`
  }
}
