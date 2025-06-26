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

