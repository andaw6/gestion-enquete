import { ConcerneData, ConcerneModel } from "./concerne.model";
import { DocumentModel } from "./document.model";
import { EnqueteModel } from "./enquete.model";
import { CodeLibelle } from "./code-libelle.model";
import { UtilisateurModel } from "./utilisateur.model";

export interface DemandeEnqueteModel {
  readonly id: number;
  reference: string;
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
}


export interface DemandeEnqueteData {
  objet: string
  description: string
  priorite: number
  dateEcheance: string
  urgent: boolean
  utilisateurId: number
  concerneId?: number
  centre?: string;
  concerne?: ConcerneData
}
