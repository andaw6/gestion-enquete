import { CodeLibelle } from './code-libelle.model';
import { DocumentModel } from './document.model';
import { EnqueteModel } from './enquete.model';
import { UtilisateurModel } from './utilisateur.model';


export interface SourceInfoModel {
  readonly id: number;
  nom: string;
  description: string;
  commentaires: string;
  fiabilite: number;
  etat: CodeLibelle;
  type: CodeLibelle;
  utilisateur: UtilisateurModel;
  documents: DocumentModel[];
  dateObtention: Date | null;
  dateMiseAJour: Date | null;
  enquetes: EnqueteModel[]
  createdAt: Date | null;
  updatedAt: Date | null;
}


export interface SourceInfoRequestData {
  id?: number;
  nom: string;
  description: string;
  commentaires: string;
  fiabilite: number;
  codeEtat: string;
  codeType: string;
  utilisateurId: number;
  dateObtention: string | Date;
  dateMiseAJour: string | Date;
  documentIds: number[];
  enqueteIds: number[];
}


export interface SourceData {
  mode: 'create' | 'select' | 'update';
  source?: SourceInfoModel;
  data?: {
    files: File[],
    source: SourceInfoRequestData
  };
};
