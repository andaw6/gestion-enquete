import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsEnqueteur } from '@modules/chef-enqueteur/enquetes/model';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent {
  @Input() stats: StatsEnqueteur = {
    nonAssignees: 0,
    urgentes: 0,
    enqueteursLibres: 0,
    aujourdhui: 0,
  }

  getTotalEnquetes(){
    return 2;
  }

  getEfficiencyRate(){
    return 4;
  }
}
