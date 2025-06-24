import {Component, Input} from '@angular/core';
import {UserStats} from "@modules/admin/parametrage/utilisateur/utilisateur";

@Component({
  selector: 'app-stats-cards',
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent {
  @Input() stats!: UserStats;
}
