import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnqueteModel } from '@core/model/enquete.model';

@Component({
  selector: 'app-enquete-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enquete-details.component.html',
  styleUrls: ['./enquete-details.component.css']
})
export class EnqueteDetailsComponent {
  @Input() enquete!: EnqueteModel;

  formatDate(date: Date | null): string {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("fr-FR")
  }

  formatDateTime(date: Date | null): string {
    if (!date) return "N/A"
    return (
      new Date(date).toLocaleDateString("fr-FR") +
      " " +
      new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    )
  }

  getStatusClass(statusCode: string): { container: string; dot: string } {
    return {
      "00": { // En attente
        container: "bg-yellow-100 text-yellow-800 border-yellow-200",
        dot: "bg-yellow-500",
      },
      "01": { // En cours
        container: "bg-blue-100 text-blue-800 border-blue-200",
        dot: "bg-blue-500",
      },
      "02": { // Terminée
        container: "bg-green-100 text-green-800 border-green-200",
        dot: "bg-green-500",
      },
      "03": { // En validation
        container: "bg-indigo-100 text-indigo-800 border-indigo-200",
        dot: "bg-indigo-500",
      },
      "04": { // Validée
        container: "bg-emerald-100 text-emerald-800 border-emerald-200",
        dot: "bg-emerald-500",
      },
      "05": { // En révision
        container: "bg-orange-100 text-orange-800 border-orange-200",
        dot: "bg-orange-500",
      },
      "06": { // Annulée
        container: "bg-red-100 text-red-800 border-red-200",
        dot: "bg-red-500",
      },
    }[statusCode] || {
      container: "bg-gray-100 text-gray-800 border-gray-200",
      dot: "bg-gray-500",
    };
  }

}
