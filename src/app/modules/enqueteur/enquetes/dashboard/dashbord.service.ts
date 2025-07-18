import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import type { Enquete, StatCard, ChartData }  from "@modules/enqueteur/enquetes/dashboard/dashboard";

@Injectable({
  providedIn: 'root'
})
export class DashbordService {
  private enquetesSubject = new BehaviorSubject<Enquete[]>([])
  public enquetes$ = this.enquetesSubject.asObservable()

  constructor() {
    this.loadMockData()
  }

  private loadMockData(): void {
    const mockEnquetes: Enquete[] = [
      {
        id: "ENQ-2024-001",
        titre: "Vérification contrat travail",
        concerne: { nom: "Entreprise ABC", type: "Employeur" },
        statut: "En cours",
        priorite: "Haute",
        progression: 75,
        echeance: new Date("2024-01-15"),
      },
      {
        id: "ENQ-2024-002",
        titre: "Contrôle formation professionnelle",
        concerne: { nom: "Martin Dubois", type: "Bénéficiaire" },
        statut: "Planifiée",
        priorite: "Normale",
        progression: 45,
        echeance: new Date("2024-01-20"),
      },
    ]
    this.enquetesSubject.next(mockEnquetes)
  }

  getStats(): StatCard[] {
    return [
      {
        title: "Enquêtes en cours",
        value: 12,
        change: 8,
        changeType: "increase",
        icon: "fas fa-clipboard-list",
        iconColor: "text-blue-600",
      },
      {
        title: "Terminées ce mois",
        value: 8,
        change: 12,
        changeType: "increase",
        icon: "fas fa-check-circle",
        iconColor: "text-green-600",
      },
      {
        title: "En attente",
        value: 3,
        change: -5,
        changeType: "decrease",
        icon: "fas fa-clock",
        iconColor: "text-yellow-600",
      },
      {
        title: "Urgentes",
        value: 2,
        change: 0,
        changeType: "stable",
        icon: "fas fa-exclamation-triangle",
        iconColor: "text-red-600",
      },
    ]
  }

  getEvolutionChartData(): ChartData {
    return {
      labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin"],
      datasets: [
        {
          label: "Enquêtes créées",
          data: [5, 8, 6, 9, 12, 10],
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14, 165, 233, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Enquêtes terminées",
          data: [3, 5, 4, 7, 8, 9],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    }
  }

  getStatutsChartData(): ChartData {
    return {
      labels: ["En cours", "Planifiées", "En attente", "Terminées"],
      datasets: [
        {
          data: [12, 5, 3, 8],
          backgroundColor: ["#0ea5e9", "#6366f1", "#f59e0b", "#10b981"],
          borderWidth: 2,
        },
      ],
    }
  }

  getTypeConcerneChartData(): ChartData {
    return {
      labels: ["Employeur", "Travailleur", "Bénéficiaire"],
      datasets: [
        {
          label: "Nombre d'enquêtes",
          data: [15, 8, 12],
          backgroundColor: ["#0ea5e9", "#38bdf8", "#7dd3fc"],
          borderWidth: 1,
        },
      ],
    }
  }

  getCompletionData(): Array<{ id: string; progression: number }> {
    return [
      { id: "ENQ-2024-001", progression: 75 },
      { id: "ENQ-2024-002", progression: 45 },
      { id: "ENQ-2024-003", progression: 90 },
      { id: "ENQ-2024-004", progression: 30 },
      { id: "ENQ-2024-005", progression: 60 },
    ]
  }
}
