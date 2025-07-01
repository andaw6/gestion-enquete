import {Document} from "@modules/enqueteur/traitement/document/document";

export interface SourceInfo {
  id: number;
  nom: string;
  description: string;
  commentaires: string;
  niveauFiabilite: string;
  etat: EtatSourceInfo;
  utilisateur: Utilisateur;
  documents: Document[];
  dateObtention: string;
  updatedAt: string;
}

export interface EtatSourceInfo {
  id: number;
  code: string;
  libelle: string;
}

export interface Utilisateur {
  id: number;
  username: string;
}


export interface Source {
  id: string
  name: string
  category: string
  description: string
  reliability: number
  status: "verified" | "available" | "to-check" | "official" | "limited-access" | "to-cross-check"
  usageCount: number
  lastUpdated: string
  icon: string
  iconColor: string
  actionType: "access" | "contact" | "consult" | "reserve" | "search"
  isFavorite: boolean
}


export interface RecentSource {
  id: number
  name: string
  icon: string
  iconColor: string
  lastUsed: string
  context: string
  actionType: "access" | "contact" | "consult"
}


// Interface pour les filtres
export interface SourceFilters {
  searchTerm: string
  etatCode: string
  niveauFiabilite: string
  sortBy: string
}


export  interface EtatSourceInfo  {
  id: number;
  libelle: string;
  code: string;
}
