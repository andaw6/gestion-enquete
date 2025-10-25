import { Component, Input } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { EnqueteModel } from '@core/model/enquete.model';
import { UtilisateurModel } from '@core/model/utilisateur.model';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf],
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent {
  @Input() enquete!: EnqueteModel;
  @Input() recommandations: string[] = [
    "Contacter l'entreprise le plus tôt possible",
    // "Programmer visite sur site aujourd'hui",
    // "Envoyer rapport préliminaire avant 17h"
  ];

  @Input() chefEnqueteur?: UtilisateurModel = {
    id: 0,
    username: "Elhadji Ciss",
    role: "Chef enquêteur"
  }
}
