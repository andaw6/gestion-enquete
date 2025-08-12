import { Utilisateur } from "@core/interfaces/utilisateur.interface"
import { EtatDemande } from "@modules/admin/parametrage/etat-demande/etat-demande"
import { EtatEnquete } from "@modules/admin/parametrage/etat-enquete/etat-enquete"

export interface StatCard {
  title: string
  value: string | number
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: string
  gradient: string
}

export interface ActivityItem {
  id: string
  title: string
  time: string
  type: "success" | "info" | "warning" | "error"
  icon: string
}

export type TypeConcerne = 'employeur' | 'travailleur' | "bénéficiaire";

export interface Concerne {
  id: number;
  type: TypeConcerne;
  numero: string;
  regionSocial: string;
}



export interface Enquete {
  id: number;
  etat: EtatEnquete;
  reference: string;
  progression: number;
  dateDebut: Date;
  dateFin: Date;
  dateValidation:Date;
  dateAnnulation:Date;
  createdAt: Date;
}

export interface DemandeEnquete {
  id: number;
  objet: string;
  description: string;
  urgent: boolean;
  commentaireValidation: string;
  priorite: number;
  reference: string;
  dateEcheance: Date;
  createdAt: Date;
  updatedAt: Date;
  dateValidation: Date | null;
  dateAnnulation: Date | null;
  etat: EtatDemande;
  enquete?: Enquete;
  concerne: Concerne;
  utilisateur: Utilisateur;
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
  }[]
}
