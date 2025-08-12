/**
 * Élément de navigation (entrée de menu).
 *
 * @property label     Libellé affiché.
 * @property icon      Nom de l'icône (Material, FontAwesome…).
 * @property route     Chemin Angular à charger lorsqu'on clique.
 * @property active    Indique si l'élément correspond à la route courante.
 * @property children  Sous‑éléments (sous‑menu).
 * @property expanded  État d'expansion du sous‑menu (UI state uniquement).
 */
export interface NavigationItem {
    label: string
    icon: string
    route?: string
    active?: boolean
    children?: NavigationItem[]
    expanded?: boolean
}

/**
 * Regroupement logique d'éléments de navigation sous un titre.
 */
export interface NavigationSection {
    title: string
    items: NavigationItem[]
}
