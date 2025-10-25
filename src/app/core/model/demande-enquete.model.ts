import { ConcerneData, ConcerneModel } from "./concerne.model";
import { DocumentModel } from "./document.model";
import { EnqueteModel } from "./enquete.model";
import { CodeLibelle } from "./code-libelle.model";
import { UtilisateurModel } from "./utilisateur.model";

export interface DemandeEnqueteModel {
  readonly id: number;
  readonly reference: string;
  objet: string;
  description: string;
  urgent: boolean;
  commentaireValidation: string;
  priorite: number;
  dateEcheance: Date | null;
  dateValidation: Date | null;
  dateAnnulation: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  etat: CodeLibelle;
  concerne: ConcerneModel;
  utilisateur?: UtilisateurModel;
  documents?: DocumentModel[];
  enquete?: EnqueteModel;
  centre?: CodeLibelle;
  validateur?: UtilisateurModel;
}


export interface DemandeEnqueteData {
  objet: string;
  description: string;
  priorite: number;
  dateEcheance: string;
  urgent: boolean;
  utilisateurId: number;
  concerneId?: number;
  centre?: string;
  concerne?: ConcerneData;
  documentIds?: number[];
}


export interface DemandeEnqueteStatEtat {
  validees: number;
  enAttentes: number;
  rejetees: number;
  annulees: number;
  enComplement: number;
}


export interface DemandeEnqueteStatEnquete {
  totalEnCours: number;
  prioriteHaute: number;
  enValidation: number;
  enRetard: number;
}


export enum DemandeEtatDemande {
  EnAttente = "00",
  Valider = "01",
  Rejeter = "02",
  EnComplement = "03",
  Annuler = "04",
}

export interface DemandeEnqueteStat {
  totalDemandes: number;
  enCours: number;
  termines: number;
  tauxReussite: number;
}

export interface DemandeEnqueteEvolution {
  jour: Date;
  creees: number;
  traitees: number
}
