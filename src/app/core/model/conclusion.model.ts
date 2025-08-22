import { CodeLibelle } from "./code-libelle.model";

export interface ConclusionModel {
  readonly id: number;
  titre: string;
  contenu: string;
  mesuresSuivi: string;
  recommandation: string;
  etat: CodeLibelle;
  dateValidation: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
