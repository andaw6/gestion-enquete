import {Component, Input} from '@angular/core';
import {SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";
import {RELIABILITY_LEVELS} from "@config/constant";
import { SourceInfoModel } from '@core/model/source-info.model';

@Component({
  selector: 'app-source-details',
  templateUrl: './source-details.component.html',
  styleUrls: ['./source-details.component.css']
})
export class SourceDetailsComponent {
  @Input() source!: SourceInfoModel;

  getStars(): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < Number(this.source.fiabilite))
  }

  getNiveauFiabilite(): string {
    if (this.source) {
      for (const {label, value} of RELIABILITY_LEVELS) {
        if (this.source.fiabilite === Number(value)) {
          return label;
        }
      }
    }
    return 'N/A';
  }
}
