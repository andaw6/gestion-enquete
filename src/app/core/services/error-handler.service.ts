import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { LoggerService } from './logger.service';

/**
 * Service centralisé pour la gestion des erreurs HTTP ou applicatives.
 *
 * Ce service extrait le message pertinent d'une erreur, logue les détails
 * via un service de journalisation, puis relance une erreur typée observable.
 *
 * À utiliser dans les opérateurs `catchError()` de RxJS.
 *
 * @example
 * this.http.get('/api/user')
 *   .pipe(catchError(this.errorHandler.handleError))
 *   .subscribe({
 *     error: (err) => console.error(err.message)
 *   });
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {

  constructor(private logger: LoggerService) {}

  /**
   * Gère une erreur HTTP ou personnalisée en extrayant un message lisible
   * et en loggant les détails via `LoggerService`.
   *
   * @param error - Objet d’erreur capturé par un appel HTTP ou une exception manuelle.
   * @returns Un Observable qui émet une erreur enrichie à utiliser dans un flux RxJS.
   *
   * @example
   * return this.http.get('/api/data').pipe(
   *   catchError(this.errorHandler.handleError)
   * );
   */
  handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue';
    const errorPayload = error?.error;

    if (errorPayload) {
      if (typeof errorPayload === 'string') {
        errorMessage = errorPayload;
      } else if (errorPayload.message) {
        errorMessage = errorPayload.message;
      } else if (errorPayload.error) {
        errorMessage = errorPayload.error;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    const data = {
      status: error.status,
      url: error.url,
      message: errorMessage,
    };

    this.logger.error({ message: "Erreur HTTP détectée", data }, 'ErrorHandlerService');

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      original: error,
    }));
  }
}
