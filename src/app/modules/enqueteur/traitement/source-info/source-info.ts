import {Document} from "@modules/enqueteur/traitement/document/document";
import {EntityType} from "@core/interfaces/entity-type.interface";
import {TypeSource} from "@modules/admin/parametrage/type-source/type-source";
import {Utilisateur} from "@core/interfaces/utilisateur.interface";

export interface SourceInfo {
  id: number;
  nom: string;
  description: string;
  commentaires: string;
  niveauFiabilite: string;
  etat: EtatSourceInfo;
  type: TypeSource;
  utilisateur: Utilisateur;
  documents: Document[];
  dateObtention: string;
  dateMiseAJour: string;
}

export interface SourceFilters {
  searchTerm: string
  etatCode: string
  niveauFiabilite: string
  sortBy: string
}

export interface EtatSourceInfo extends EntityType {
}


export interface TeamMember {
  nom: string
  role: string
  icone: string
  couleur: string
}

export interface TimelineEvent {
  titre: string
  date: string
  couleur: string
}
