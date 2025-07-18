export interface Utilisateur {
  id?: number
  prenom: string
  nom: string
  email: string
  telephone: string
  motDePasse: string
  actif: boolean
  derniereConnexion?: Date
  dateCreation: Date
  superviseur?: Utilisateur
  uniteOrganisationnelle: UniteOrganisationnelle
  centreGestion: CentreGestion
  roles: Role[]
  permissions: Permission[]
  fonctions: Fonction[]
}

export interface DemandeEnquete {
  id?: number
  objet: string
  description: string
  dateCreation: Date
  dateValidation?: Date
  dateAnnulation?: Date
  commentaireValidation?: string
  priorite: "HAUTE" | "MOYENNE" | "BASSE"
  dateEcheance: Date
  urgent: boolean
  etatDemande: EtatDemande
  utilisateurDemandeur: Utilisateur
  utilisateurValidateur?: Utilisateur
  centreGestion: CentreGestion
  concernes: Concerne[]
  documents: DocumentDemandeEnquete[]
}


export interface EtatDemande {
  id?: number
  libelle: string
  code: string
}

export interface TypeConcerne {
  id?: number
  libelle: string
  code: string
}

export interface Concerne {
  id?: number
  attributs: any
  typeConcerne: TypeConcerne
}

export interface CentreGestion {
  id?: number
  libelle: string
  code: string
}

export interface UniteOrganisationnelle {
  id?: number
  nom: string
  description: string
  niveau: number
  parent?: UniteOrganisationnelle
}

export interface Role {
  id?: number
  nom: string
  description: string
}

export interface Permission {
  id?: number
  code: string
  description: string
  module: string
}

export interface Fonction {
  id?: number
  libelle: string
  description: string
}

export interface DocumentDemandeEnquete {
  id?: number
  type: string
  document: Document
}

export interface Document {
  id?: number
  nom: string
  description: string
  chemin: string
  dateAjout: Date
  taille: number
  typeDocument: TypeDocument
}

export interface TypeDocument {
  id?: number
  libelle: string
  code: string
}



export interface StatsCard {
  title: string
  value: number
  icon: string
  color: string
}

export interface FilterOptions {
  searchTerm: string
  priorite: string
  typeConcerne: string
  sortBy: string
}
