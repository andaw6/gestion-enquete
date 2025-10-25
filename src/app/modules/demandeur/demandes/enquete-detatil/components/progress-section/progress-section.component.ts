import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnqueteModel } from '@core/model/enquete.model';

@Component({
  selector: 'app-progress-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-section.component.html',
  styleUrls: ['./progress-section.component.css']
})
export class ProgressSectionComponent {
  @Input() enquete!: EnqueteModel;

  getCurrentStepDescription(): string {
    const progress = this.enquete?.progression || 0
    if (progress < 20) return "Étape actuelle : Initialisation"
    if (progress < 40) return "Étape actuelle : Collecte des données"
    if (progress < 60) return "Étape actuelle : Collecte des témoignages"
    if (progress < 80) return "Étape actuelle : Analyse des résultats"
    return "Étape actuelle : Finalisation du rapport"
  }
}
