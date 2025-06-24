import {Pagination} from "@core/interfaces/pagination.interface";

// export interface GenericCrudConfig {
//   // Configuration de la liste
//   pageTitle: string
//   pageDescription: string
//   listTitle: string
//   listDescription: string
//   addButtonText: string
//   addButtonIcon?: string
//
//   // Configuration du modal
//   createTitle: string
//   editTitle: string
//   createDescription: string
//   editDescription: string
//   codeLabel: string
//   codePlaceholder: string
//   labelLabel: string
//   labelPlaceholder: string
//   createButtonText: string
//   editButtonText: string
//   cancelButtonText: string
//   iconSvgPath?: string
//
//   // Configuration des messages
//   deleteConfirmTitle?: string
//   deleteConfirmMessage?: string
//   createSuccessMessage?: string
//   updateSuccessMessage?: string
//   deleteSuccessMessage?: string
//   loadErrorMessage?: string
//
//   // Validation
//   codeMinLength?: number
//   codeMaxLength?: number
//   labelMinLength?: number
//   labelMaxLength?: number
//   codePattern?: RegExp
//
//   // Pagination
//   paginationStorageKey: string
// }


export interface GenericModalConfig {
  // Titres et descriptions
  createTitle: string
  editTitle: string
  createDescription: string
  editDescription: string

  // Configuration des champs
  codeLabel: string
  codePlaceholder: string
  labelLabel: string
  labelPlaceholder: string

  // Boutons
  createButtonText: string
  editButtonText: string
  cancelButtonText: string

  // Icône du modal
  iconSvgPath?: string

  // Validation personnalisée
  codeMinLength?: number
  codeMaxLength?: number
  labelMinLength?: number
  labelMaxLength?: number
  codePattern?: RegExp
}

export interface GenericCrudConfig extends GenericModalConfig {
  // Configuration de la liste
  pageTitle: string
  pageDescription: string
  listTitle: string
  listDescription: string
  addButtonText: string
  addButtonIcon?: string

  // Configuration des messages
  deleteConfirmTitle?: string
  deleteConfirmMessage?: string
  createSuccessMessage?: string
  updateSuccessMessage?: string
  deleteSuccessMessage?: string
  loadErrorMessage?: string

  // Pagination
  paginationStorageKey: string
}


export interface CrudEvents<T> {
  loadData: { pagination: Pagination }
  createItem: { code: string; libelle: string }
  updateItem: { id: number; data: { code: string; libelle: string } }
  deleteItem: { id: number }
  pageChanged: { pagination: Pagination }
}


export interface CrudItem {
  id: number
  code: string
  libelle: string
}


export interface GenericFormData {
  id?: number
  code: string
  libelle: string
}

