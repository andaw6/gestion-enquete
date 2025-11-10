type TypeConcerne = "employeur" | "beneficiaire" | "travailleur";
interface CodeLibelle {
  readonly code: string;
  readonly libelle: string;
}
interface UtilisateurModel {
  readonly id: number;
  username: string;
}
interface ConcerneModel {
  readonly id: number;
  type: TypeConcerne;
  telephone: string;
  regionSocial: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
interface SourceInfoModel {
  readonly id: number;
  nom: string;
  description: string;
  commentaires: string;
  fiabilite: number;
  etat: CodeLibelle;
  type: CodeLibelle;
  utilisateur: UtilisateurModel;
  dateObtention: Date | null;
  dateMiseAJour: Date | null;
  documents: DocumentModel[];
  enquetes: EnqueteModel[]
}
interface SourceInfoRequestData {
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

interface ConclusionModel {
  readonly id: number;
  titre: string;
  contenu: string;
  mesuresSuivi: string;
  recommandation: string;
  etat: CodeLibelle;
  dateValidation: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  enquete: EnqueteModel;
}
interface DemandeEnqueteModel {
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
  enquete?: EnqueteModel;
  documents: DocumentModel[];
}
export interface EnqueteModel {
  readonly id: number;
  etat: CodeLibelle;
  reference: string;
  progression: number;
  dateDebut: Date | null;
  dateFin: Date | null;
  dateValidation: Date | null;
  dateAnnulation: Date | null;
  dateAssignation: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  demande?: DemandeEnqueteModel;
  enqueteur?: UtilisateurModel;
  sourceInfos: SourceInfoModel[];
  conclusions: ConclusionModel[];
}
interface DocumentModel {
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

export enum DemandeEtatDemande {
  EnAttente = "00",
  Valider = "01",
  Rejeter = "02",
  EnComplement = "03",
  Annuler = "04",
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
