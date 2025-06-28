import {TypeDocument} from "@modules/admin/parametrage/type-document/type-document";

export interface Document {
  id: number
  nom: string
  description?: string
  chemin: string
  extension: string
  taille: number
  version: number
  type: TypeDocument
  createdAt?: string
  updatedAt?: string
  enqueteId?: string
}

export interface DocumentUrl {
  documentId: number;
  viewUrl: string;
  downloadUrl: string;
  contentType: string;
  canPreview: boolean;
}

export interface FilterOptions {
  searchTerm: string
  filterType: string
  sortBy: string
  viewMode: "grid" | "list"
}

export interface DocumentUpload {
  file: File;
  investigation: string;
  documentType: string;
  documentName: string;
  documentDescription: string;
}


export interface DocumentData {
  nom: string;
  description: string;
  typeId: number;
  file: File
}
