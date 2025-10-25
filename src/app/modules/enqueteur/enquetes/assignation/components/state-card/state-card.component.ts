import { Component, Input } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { StateCard } from '@modules/enqueteur/enquetes/model';

@Component({
  selector: 'app-state-card',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf],
  templateUrl: './state-card.component.html',
  styleUrls: ['./state-card.component.css']
})
export class StateCardComponent {
  @Input({ required: true }) state!: StateCard;
}
