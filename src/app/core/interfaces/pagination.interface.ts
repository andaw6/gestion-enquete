
/**
 * Métadonnées de pagination standard.
 *
 * @property page       Numéro de la page courante (base 1).
 * @property limit      Nombre d'éléments par page.
 * @property totalItem  Nombre total d'éléments disponibles côté serveur.
 * @property totalPage  Nombre total de pages (dérivé de `totalItem / limit`).
 */
export interface  Pagination {
    page: number,
    limit: number,
    totalItem: number,
    totalPage: number
}

