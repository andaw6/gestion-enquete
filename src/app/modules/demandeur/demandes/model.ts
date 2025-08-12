export interface DemandeEnqueteData {
  objet: string
  description: string
  priorite: number
  dateEcheance: string
  urgent: boolean
  utilisateurId: number
  concerneId?: number
  centre?: string;
  concerne?: NouveauConcerne
}

export interface NouveauConcerne {
  type: "employeur" | "beneficiaire" | "travailleur"
  numero: string
  regionSocial: string
}

export interface Concerne {
  id: number
  type: string
  numero: string
  regionSocial: string
}

