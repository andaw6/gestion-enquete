import { Component, Input } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { ConcerneModel } from '@core/model/concerne.model';

@Component({
  selector: 'app-personne-concernee',
  standalone: true,
  imports: [CommonModule, NgIf, NgClass],
  templateUrl: './personne-concernee.component.html',
  styleUrls: ['./personne-concernee.component.css']
})
export class PersonneConcerneeComponent {
  @Input() concerne!: ConcerneModel

  getTypeClass(type: string): string {
    switch (type.toLowerCase()) {
      case "employeur":
        return "bg-blue-100 text-blue-800"
      case "employé":
        return "bg-green-100 text-green-800"
      case "syndicat":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
}
