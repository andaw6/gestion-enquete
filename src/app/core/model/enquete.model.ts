import { DemandeEnqueteModel } from "./demande-enquete.model";
import { CodeLibelle } from "./code-libelle.model";
import { UtilisateurModel } from "./utilisateur.model";

export interface EnqueteModel {
  readonly id: number;
  readonly reference: string;
  etat: CodeLibelle;
  instruction: string;
  progression: number;
  dateDebut: Date | null;
  dateFin: Date | null;
  dateValidation: Date | null;
  dateAnnulation: Date | null;
  dateAssignation: Date | null;
  dateLimite: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  demande?: DemandeEnqueteModel;
  enqueteur?: UtilisateurModel;
}


export enum EnqueteEtatEnquete {
  EnAttente = "00",
  EnCours = "01",
  Terminee = "02",
  EnValidation = "03",
  Validee = "04",
  EnRevision = "05",
  Annulee = "06",
}


export interface EnqueteStatEtat {
  enAttente: number;
  enCours: number;
  terminees: number;
  enValidation: number;
  enRevision: number;
  valides: number;
  annulees: number;
  echeances: number;
  total: number;
}