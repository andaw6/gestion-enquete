import { Component, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { CodeLibelle } from '@core/model/code-libelle.model';

@Component({
  selector: 'app-demande-status-indicators',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './demande-status-indicators.component.html',
  styleUrls: ['./demande-status-indicators.component.css']
})
export class DemandeStatusIndicatorsComponent {
  @Input() etat!: CodeLibelle
  @Input() urgent = false
  @Input() priorite = 1

  getPrioriteLabel(priorite: number): string {
    const labels = ["très faible", "faible", "normale", "élevée", "critique"]
    return labels[priorite - 1] || "normale"
  }
}
