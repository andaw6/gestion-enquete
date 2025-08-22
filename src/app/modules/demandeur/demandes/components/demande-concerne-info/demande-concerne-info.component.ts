import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConcerneModel } from '@core/model/concerne.model';

@Component({
  selector: 'app-demande-concerne-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demande-concerne-info.component.html',
  styleUrls: ['./demande-concerne-info.component.css']
})
export class DemandeConcerneInfoComponent {
  @Input() concerne!: ConcerneModel;

}
