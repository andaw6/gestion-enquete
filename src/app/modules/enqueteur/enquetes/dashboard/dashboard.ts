export interface Enquete {
  id: string
  titre: string
  concerne: {
    nom: string
    type: "Employeur" | "Travailleur" | "Bénéficiaire"
  }
  statut: "En cours" | "Planifiée" | "En attente" | "Terminée"
  priorite: "Haute" | "Normale" | "Basse"
  progression: number
  echeance: Date
}

export interface StatCard {
  title: string
  value: number
  change: number
  changeType: "increase" | "decrease" | "stable"
  icon: string
  iconColor: string
}

export interface ChartData {
  labels: string[]
  datasets: any[]
}

