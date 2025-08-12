import { DemandeEnqueteModel } from "./demande-enquete.model";
import { CodeLibelle } from "./code-libelle.model";

export interface EnqueteModel {

  readonly id: number;

  etat: CodeLibelle;

  reference: string;

  progression: number;

  dateDebut: Date | null;

  dateFin: Date | null;

  dateValidation: Date | null;

  dateAnnulation: Date | null;

  createdAt: Date | null;

  updatedAt: Date | null;

  demande?: DemandeEnqueteModel;
}
