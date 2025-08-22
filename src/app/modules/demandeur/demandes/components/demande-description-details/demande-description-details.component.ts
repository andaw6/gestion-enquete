import { Component, Input } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';

@Component({
  selector: 'app-demande-description-details',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './demande-description-details.component.html',
  styleUrls: ['./demande-description-details.component.css']
})
export class DemandeDescriptionDetailsComponent {
  @Input() demande!: DemandeEnqueteModel;

  verificationPoints = [
    "Respect des horaires de travail légaux",
    "Conditions de sécurité sur le lieu de travail",
    "Vérification des équipements de protection",
    "Contrôle des registres de présence",
  ]
}
