import {Document} from "@modules/enqueteur/traitement/document/document";
import {EntityType} from "@core/interfaces/entity-type.interface";
import {TypeSource} from "@modules/admin/parametrage/type-source/type-source";
import {Utilisateur} from "@core/interfaces/utilisateur.interface";
import {RELIABILITY_LEVELS, SOURCE_INFO_TRI} from "@config/constant";

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

export type SourceSortBy = typeof SOURCE_INFO_TRI[number]['value'];
export type SourceNiveauFiabilite = typeof RELIABILITY_LEVELS[number]['value'];

export interface SourceFiltersOption {
  searchTerm: string;
  etatCode: string;
  typeCode: string;
  niveauFiabilite: SourceNiveauFiabilite | "";
  sortBy: SourceSortBy;
}

export interface EtatSourceInfo extends EntityType {
}

export interface TimelineEvent {
  titre: string;
  date: string;
  couleur: string;
}
