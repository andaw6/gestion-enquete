import { CodeLibelle } from "./code-libelle.model";

export interface DocumentModel {

  readonly id: number;

  nom: string;

  description: string;

  chemin: string;

  extension: string;

  taille: number;

  version: number;

  type: CodeLibelle;

  createdAt: Date | null;

  updatedAt: Date | null;

}
