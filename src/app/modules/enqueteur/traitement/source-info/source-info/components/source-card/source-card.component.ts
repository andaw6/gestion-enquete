import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";

@Component({
  selector: 'app-source-card',
  templateUrl: './source-card.component.html',
  styleUrls: ['./source-card.component.css']
})
export class SourceCardComponent {
  @Input() source!: SourceInfo
  @Output() onActionClick: EventEmitter<SourceInfo> = new EventEmitter<SourceInfo>();
  @Output() onUpdatedClick: EventEmitter<SourceInfo> = new EventEmitter<SourceInfo>();
  @Input() selected: boolean = false;


  getStars(): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < Number(this.source.niveauFiabilite))
  }

  getUsageText(): string {
    return `${"Utilisée"} ${'N'} fois`
  }

}
