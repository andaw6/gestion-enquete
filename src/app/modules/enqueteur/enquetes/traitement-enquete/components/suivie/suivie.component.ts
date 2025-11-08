import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, SurveyService } from '../../test';
import { EnqueteModel } from '@core/model/enquete.model';
import { EnqueteStateService } from '@store/enquete/enquete-state.service';

@Component({
  selector: 'app-suivie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suivie.component.html',
  styleUrls: ['./suivie.component.css']
})
export class SuivieComponent implements OnInit {
  private surveyService = inject(SurveyService)
  private notificationService = inject(NotificationService)
  enquete!: EnqueteModel;
  private readonly enqueteState = inject(EnqueteStateService);

  surveyData = this.surveyService.getSurveyData()

  ngOnInit(): void {
    this.enqueteState.enquete$.subscribe(enquete => {
      if (enquete) {
        this.enquete = enquete;
      }
    })
  }

  getStatusLabel(status: string): string {
    const labels = {
      draft: "Brouillon",
      "in-progress": "En cours",
      completed: "Terminé",
    }
    return labels[status as keyof typeof labels] || status
  }

  getPriorityLabel(priority: string): string {
    const labels = {
      low: "Priorité Basse",
      medium: "Priorité Moyenne",
      high: "Priorité Haute",
      critical: "Priorité Critique",
    }
    return labels[priority as keyof typeof labels] || priority
  }

  saveDraft() {
    this.surveyService.saveDraft()
    this.notificationService.show("Brouillon sauvegardé", "Toutes les données ont été sauvegardées", "success")
  }

  finalizeInvestigation() {
    if (confirm("Êtes-vous sûr de vouloir finaliser cette enquête ? Cette action est irréversible.")) {
      // this.notificationService.show("Enquête finalisée", "L'enquête a été clôturée et le rapport généré", "success")
    }
  }

  getTitle(): string {
    const concerneLabels: Record<string, string> = {
      employeur: "Employeur",
      travailleur: "Travailleur",
      beneficiaire: "Bénéficiaire",
    };

    const type = this.enquete.demande?.concerne?.type;
    const telephone = this.enquete.demande?.concerne?.telephone;
    const region = this.enquete.demande?.concerne.regionSocial ?? "N/A";

    const label = type ? (concerneLabels[type] ?? "Inconnu") : "Inconnu";
    const phone = telephone ?? "N/A";

    return `Enquête concernant ${label} - ${phone}`;
  }


  getTemoignages() {
    return this.enquete.autresInfos?.filter(aut => aut.categorie == "temoignage") ?? [];
  }

  getObservations() {
    return this.enquete.autresInfos?.filter(aut => aut.categorie.includes("observation-")) ?? [];
  }

}
