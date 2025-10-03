import {Component, EventEmitter, Input, Output} from '@angular/core';
import { SourceInfoModel } from '@core/model/source-info.model';
import {SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";

@Component({
  selector: 'app-source-card',
  templateUrl: './source-card.component.html',
  styleUrls: ['./source-card.component.css']
})
export class SourceCardComponent {
  @Input() source!: SourceInfoModel;
  @Output() onActionClick = new EventEmitter<SourceInfoModel>();
  @Output() onUpdatedClick = new EventEmitter<SourceInfoModel>();
  @Input() selected: boolean = false;


  getStars(): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < Number(this.source.fiabilite))
  }

  getUsageText(): string {
    return `${"Utilisée"} ${'N'} fois`
  }

}
