import {Component, Input} from '@angular/core';
import { TimelineEvent} from "@modules/enqueteur/traitement/source-info/source-info";
import {Utilisateur} from "@core/interfaces/utilisateur.interface";

@Component({
  selector: 'app-source-sidebar',
  templateUrl: './source-sidebar.component.html',
  styleUrls: ['./source-sidebar.component.css']
})
export class SourceSidebarComponent {
  @Input() teamMembers: Utilisateur[] = [];
  @Input() timeline: TimelineEvent[] = [];
  @Input() niveauFiabilite: number = 0;

  getProgress() {
    return !this.niveauFiabilite ? 0 : Math.floor((100 * this.niveauFiabilite) / 5);
  }
}

