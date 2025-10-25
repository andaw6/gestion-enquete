import { CodeLibelle } from "./code-libelle.model";
import { EnqueteModel } from "./enquete.model";

export interface AutreInfoModel {
  readonly id: number;
  categorie: string;
  objet: string;
  description: string;
  importance: number;
  etat: CodeLibelle;
  dateEnregistrement: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  enquete: EnqueteModel;
}

export interface AutreInfoRequestData {
  categorie: string;
  objet: string;
  description: string;
  importance: number;
  codeEtat: string;
  dateEnregistrement: Date | null;
  enqueteId: number;
}
