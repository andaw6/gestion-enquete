import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() bgColor: string = '';
  @Input() iconColor: string = '';
  @Input() subtitleColor: string = '';
  @Input() animationDelay: number = 0;
}
