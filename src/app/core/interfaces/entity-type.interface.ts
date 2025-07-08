/**
 * Prototype d'entité disposant d'un identifiant numérique et de champs
 * business courants.
 */
export interface EntityType {
  /** Identifiant unique (généralement fourni par la base de données). */
  id: number;
  /** Nom ou libellé lisible par l'utilisateur. */
  libelle: string;
  /** Code ou slug unique de l'entité. */
  code: string;
  /** Date ISO de création (définie par le serveur). */
  createdAt?: string;
  /** Date ISO de dernière mise à jour. */
  updatedAt?: string;
}
