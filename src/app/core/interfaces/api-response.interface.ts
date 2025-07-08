import { Pagination } from "./pagination.interface";

/**
 * Modèle générique pour les réponses paginées émanant du backend.
 *
 * @typeParam T - Type des éléments contenus dans `data`.
 * @property data        Tableau des entités retournées.
 * @property pagination  Métadonnées liées à la pagination.
 */
export interface ApiResponse<T> {
  data: T[]
  pagination: Pagination
}

