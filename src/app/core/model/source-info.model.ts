import { CodeLibelle } from './code-libelle.model';
import { DocumentModel } from './document.model';
import { EnqueteModel } from './enquete.model';


export interface SourceInfoModel {

  readonly id: number;

  nom: string;

  description: string;

  commentaires: string;

  fiabilite: number;

  etat: CodeLibelle;

  type: CodeLibelle;

  utilisateurId: number;

  documents: DocumentModel[];

  dateObtention: Date | null;

  dateMiseAJour: Date | null;

  enquetes: EnqueteModel[]
}
