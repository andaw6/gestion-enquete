import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {tap, catchError, map} from 'rxjs/operators';
import {environment} from '@env/environment';
import {HttpOptions, IParams} from '@core/interfaces/http-options.interface';
import {ApiResponse} from '@core/interfaces/api-response.interface';

/**
 * Service abstrait fournissant une couche d'accès HTTP générique et sécurisée.
 *
 * @remarks
 * Cette classe centralise :
 * 1. La construction de l'URL de base de l'API (issue du fichier `environment`).
 * 2. L'injection automatique du jeton JWT présent dans le `sessionStorage` dans l'en‑tête `Authorization`.
 * 3. La gestion des en‑têtes standards (`Accept: application/json`) et du flag `withCredentials`.
 * 4. Le logging (en mode développement) de chaque requête HTTP avec sa réponse.
 * 5. Une gestion d'erreur unifiée avec extraction du message métier.
 * 6. Des méthodes « helpers » (get/post/put/delete) génériques typées, ainsi que des wrappers
 *    orientés « CRUD » (`responseGetMany`, `responsePostOne`, etc.) retournant des structures
 *    prêtes à l'emploi pour les composants de liste et de formulaire.
 *
 * @example
 * ```ts
 * // Exemple de service enfant
 * @Injectable({ providedIn: 'root' })
 * export class UserService extends ApiService {
 *   constructor(http: HttpClient) {
 *     super(http);
 *     this.setBaseUrl('/users');
 *   }
 *
 *   findAll(params?: IParams) {
 *     return this.responseGetMany<User>(params);
 *   }
 * }
 * ```
 */
export abstract class ApiService {
  /** URL de base complète de l'API (dépend de l'environnement). */
  private _baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {
  }

  /**
   * Définit dynamiquement un nouveau segment d'URL de base.
   *
   * @param url - Segment à concaténer à l'URL de base déclarée dans l'environnement.
   */
  protected setBaseUrl(url: string): void {
    this._baseUrl = environment.apiUrl + url;
  }

  /**
   * Retourne l'URL de base courante (lecture seule).
   */
  protected get baseUrl(): string {
    return this._baseUrl;
  }

  /**
   * Récupère le token JWT stocké dans le `sessionStorage`.
   *
   * @returns Le token ou `null` s'il est absent ou si l'exécution n'est pas côté navigateur.
   */
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  /**
   * Ajoute systématiquement l'en‑tête `Authorization` (si token présent) et l'en‑tête
   * `Accept: application/json`. Active également `withCredentials`.
   *
   * @param options - Options HTTP initiales (facultatives).
   * @returns Les options enrichies prêtes à être passées à `HttpClient`.
   */
  private addAuthHeader(options: HttpOptions = {}): HttpOptions {
    const token = this.getToken();
    let headers = options.headers || new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    headers = headers.set('Accept', 'application/json');
    return {...options, headers, withCredentials: true};
  }

  /**
   * Effectue une requête HTTP GET générique.
   *
   * @typeParam T - Type de la réponse attendue.
   * @param endpoint - Chemin relatif (à `baseUrl`).
   * @param params - Paramètres de requête (transformés en query string).
   * @param options - Options HTTP supplémentaires.
   */
  protected get<T>(
    endpoint: string,
    params?: IParams,
    options?: HttpOptions
  ): Observable<T> {
    let fullUrl = `${this.baseUrl}${endpoint}`;
    if (params) {
      const queryString = this.formatQueryParams(params);
      fullUrl += `?${queryString}`;
    }
    return this.http.get<T>(fullUrl, this.addAuthHeader(options)).pipe(
      tap((response) => this.logResponse('GET', fullUrl, response)),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Effectue une requête HTTP POST générique.
   *
   * @typeParam T - Type de la réponse attendue.
   * @param endpoint - Chemin relatif (à `baseUrl`).
   * @param data - Corps JSON à envoyer.
   * @param options - Options HTTP supplémentaires.
   */
  protected post<T>(endpoint: string, data: any, options?: HttpOptions): Observable<T> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.post<T>(fullUrl, data, this.addAuthHeader(options)).pipe(
      tap((response) => this.logResponse('POST', fullUrl, response)),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Effectue une requête HTTP PUT générique.
   *
   * @typeParam T - Type de la réponse attendue.
   * @param endpoint - Chemin relatif (à `baseUrl`).
   * @param data - Corps JSON à envoyer.
   * @param options - Options HTTP supplémentaires.
   */
  protected put<T>(endpoint: string, data: any, options?: HttpOptions): Observable<T> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.put<T>(fullUrl, data, this.addAuthHeader(options)).pipe(
      tap((response) => this.logResponse('PUT', fullUrl, response)),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Effectue une requête HTTP DELETE générique.
   *
   * @typeParam T - Type de la réponse attendue.
   * @param endpoint - Chemin relatif (à `baseUrl`).
   * @param options - Options HTTP supplémentaires.
   */
  protected delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.delete<T>(fullUrl, this.addAuthHeader(options)).pipe(
      tap((response) => this.logResponse('DELETE', fullUrl, response)),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Affiche la réponse HTTP dans la console (mode développement).
   *
   * @param method - Verbe HTTP.
   * @param url - URL finale appelée.
   * @param response - Corps de la réponse.
   */
  private logResponse(method: string, url: string, response: unknown): void {
    if (!environment.production) {
      console.info(`[${method}] ${url}:`, response);
    }
  }

  /**
   * Transforme l'erreur HTTP brute en structure normalisée et journalise le détail.
   *
   * @param error - Erreur `HttpErrorResponse` ou assimilée.
   * @returns Observable émettant l'erreur mappée.
   */
  private handleError(error: any): Observable<never> {
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

    // eslint-disable-next-line no-console
    console.error('Erreur HTTP détectée :', {
      status: error.status,
      url: error.url,
      message: errorMessage,
    });

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      original: error,
    }));
  }

  /**
   * Convertit un objet clé‑valeur en chaîne de paramètres de requête.
   *
   * @param params - Objet contenant les paires clé/valeur.
   * @returns Chaîne query‑string encodée.
   */
  protected formatQueryParams(params: Record<string, any>): string {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return httpParams.toString();
  }


  /**
   * Wrapper GET retournant un tableau paginé selon le format Spring Data.
   *
   * - Traduit automatiquement les propriétés « page / limit » côté front en
   *   « page / size » côté backend.
   * - Déplace la base 0 vers la base 1 pour la page courante.
   *
   * @typeParam T - Type des éléments contenus dans `data`.
   * @param params - Paramètres de pagination / filtre.
   * @param url - Surcharge de l'URL (par défaut `/`).
   * @returns Un `Observable<ApiResponse<T>>` contenant `data` et `pagination`.
   */
  protected responseGetMany<T = any>(
    params?: IParams,
    url?: string
  ): Observable<ApiResponse<T>> {
    const springParams: IParams = {...params};

    if (params?.["page"] !== undefined && params?.["limit"] !== undefined) {
      springParams['page'] = Math.max(0, params?.["page"] - 1);
      springParams['size'] = params["limit"];
      delete springParams['limit'];
      delete springParams['totalItem'];
      delete springParams['totalPage'];
    }

    return this.get<T>(url ?? '/', springParams).pipe(
      map((response: any) => {
        if (response && response.content) {
          return {
            data: response.content as T[],
            pagination: {
              totalItem: response.totalElements,
              page: response.number + 1,
              limit: response.size,
              totalPage: response.totalPages,
            },
          } as ApiResponse<T>;
        }
        throw new Error('Réponse inattendue du backend');
      }),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Erreur de récupération des données', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Wrapper GET pour récupérer une ressource unique.
   *
   * @typeParam T - Type de la ressource.
   * @param url - Endpoint.
   * @param params - Paramètres de requête.
   */
  protected responseGetOne<T = any>(url: string, params: IParams = {}): Observable<T | null> {
    return this.get<T>(url, params).pipe(
      map((response) => response ?? null),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Erreur de récupération', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Wrapper POST pour créer une ressource.
   *
   * @typeParam T - Type de la ressource créée.
   * @param url - Endpoint.
   * @param data - Payload.
   */
  protected responsePostOne<T = any>(data: any, url?: string): Observable<T> {
    return this.post<T>(url ?? "", data).pipe(
      map((response) => response ?? data),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Erreur lors du POST', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Wrapper PUT pour mettre à jour une ressource.
   *
   * @typeParam T - Type de la ressource mise à jour.
   * @param url - Endpoint.
   * @param data - Payload.
   */
  protected responsePutOne<T = any>(url: string, data: any): Observable<T> {
    return this.put<T>(url, data).pipe(
      map((response) => response ?? data),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Erreur lors du PUT', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Wrapper DELETE pour supprimer une ressource.
   *
   * @param url - Endpoint.
   * @returns `true` en cas de succès.
   */
  protected responseDeleteOne<T = any>(url: string): Observable<boolean> {
    return this.delete<T>(url).pipe(
      map(() => true),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Erreur de suppression', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Wrapper DELETE pour supprimer plusieurs ressources via payload.
   *
   * @param url - Endpoint.
   * @param data - Tableau ou objet d'identifiants.
   * @returns `true` en cas de succès.
   */
  protected responseDeleteMany<T = any>(url: string, data: any): Observable<boolean> {
    const fullUrl = `${this.baseUrl}${url}`;
    const options: { headers?: HttpHeaders; params?: HttpParams; withCredentials?: boolean; body: any } = {
      ...this.addAuthHeader(),
      body: data,
    };

    return this.http.request<T>('DELETE', fullUrl, options).pipe(
      map(() => true),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Erreur de suppression multiple', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Wrapper POST pour créer plusieurs ressources en une seule requête.
   *
   * @typeParam T - Type des ressources créées.
   * @param url - Endpoint.
   * @param data - Tableau d'objets.
   */
  protected responsePostMany<T = any>(url: string, data: any[]): Observable<T[]> {
    return this.post<T[]>(url, data).pipe(
      map((response) => response ?? data),
      catchError((error) => {
        // eslint-disable-next-line no-console
        console.error('Erreur lors du POST multiple', error);
        return throwError(() => error);
      })
    );
  }
}
