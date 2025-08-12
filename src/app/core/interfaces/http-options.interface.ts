import { HttpHeaders, HttpParams } from '@angular/common/http';

/**
 * Alias typé autour des options d'`HttpClient` pour unifier l'utilisation dans
 * notre couche API.
 */
export interface HttpOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
  /**
   * Active la transmission des cookies entre domaines (utile si l'API utilise
   * une session en plus du JWT).
   */
  withCredentials?: boolean;
}

/**
 * Dictionnaire libre utilisé pour composer les query‑params ou le corps d'une
 * requête. Aucune clé n'est imposée.
 */
export interface IParams {
  [key: string]: any;
}
