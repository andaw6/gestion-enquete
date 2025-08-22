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
  utilisateurId: number;
  dateObtention: Date | null;
  dateMiseAJour: Date | null;
  documents: DocumentModel[];
  enquetes: EnqueteModel[]
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
  enquete:EnqueteModel;
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
interface EnqueteModel {
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
