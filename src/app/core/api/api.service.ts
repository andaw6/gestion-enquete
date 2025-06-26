import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment.development';
import { HttpOptions, IParams } from '@core/interfaces/http-options.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import {ApiResponse} from "@core/interfaces/api-response.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected setBaseUrl(url: string) {
    this.baseUrl = environment.apiUrl + url;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  private addAuthHeader(options: HttpOptions = {}): HttpOptions {
    const token = this.getToken();
    let headers = options.headers || new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    headers = headers.set('Accept', 'application/json');
    return { ...options, headers, withCredentials: true };
  }

  protected get<T>(endpoint: string, params?: { [key: string]: any }, options?: HttpOptions): Observable<T> {
    let fullUrl = `${this.baseUrl}${endpoint}`;
    if (params) {
      const queryString = this.formatQueryParams(params);
      fullUrl += `?${queryString}`;
    }
    return this.http.get<T>(fullUrl, this.addAuthHeader(options)).pipe(
      tap(response => this.logResponse('GET', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }

  protected post<T>(endpoint: string, data: any, options?: HttpOptions): Observable<T> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.post<T>(fullUrl, data, this.addAuthHeader(options)).pipe(
      tap(response => this.logResponse('POST', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }

  protected put<T>(endpoint: string, data: any, options?: HttpOptions): Observable<T> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.put<T>(fullUrl, data, this.addAuthHeader(options)).pipe(
      tap(response => this.logResponse('PUT', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }

  protected delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.delete<T>(fullUrl, this.addAuthHeader(options)).pipe(
      tap(response => this.logResponse('DELETE', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }

  private logResponse(method: string, url: string, response: any): void {
    if (!environment.production) {
      console.log(`[${method}] ${url}:`, response);
    }
  }

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

    console.error('Erreur HTTP détectée :', {
      status: error.status,
      url: error.url,
      message: errorMessage,
    });

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      original: error
    }));
  }

  protected formatQueryParams(params: { [key: string]: any }): string {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return httpParams.toString();
  }

  protected responseGetMany<T>(params?: IParams, url?: string): Observable<ApiResponse<T>> {
    const springParams = { ...params };

    if (params?.["page"] !== undefined && params?.["limit"] !== undefined) {
      springParams['page'] = Math.max(0, params["page"] - 1);
      springParams['size'] = params["limit"];
      delete springParams['limit'];
      delete springParams["totalItem"];
      delete springParams["totalPage"];
    }

    return this.get<any>(url ?? "/", springParams).pipe(
      map(response => {
        if (response && response.content) {
          return {
            data: response.content,
            pagination: {
              totalItem: response.totalElements,
              page: response.number + 1,
              limit: response.size,
              totalPage: response.totalPages
            }
          };
        }
        throw new Error("Réponse inattendue du backend");
      }),
      catchError((error) => {
        console.error("Erreur de récupération des données", error);
        return throwError(() => error);
      })
    );
  }

  protected responseGetOne<T>(url: string): Observable<T | null> {
    return this.get<T>(url).pipe(
      map(response => response ?? null),
      catchError((error) => {
        console.error("Erreur de récupération", error);
        return throwError(() => error);
      })
    );
  }

  protected responsePostOne<T>(url: string, data: any): Observable<T> {
    return this.post<T>(url, data).pipe(
      map(response => response ?? data),
      catchError((error) => {
        console.error("Erreur lors du POST", error);
        return throwError(() => error);
      })
    );
  }

  protected responsePutOne<T>(url: string, data: any): Observable<T> {
    return this.put<T>(url, data).pipe(
      map(response => response ?? data),
      catchError((error) => {
        console.error("Erreur lors du PUT", error);
        return throwError(() => error);
      })
    );
  }

  protected responseDeleteOne<T>(url: string): Observable<boolean> {
    return this.delete(url).pipe(
      map(() => true),
      catchError((error) => {
        console.error("Erreur de suppression", error);
        return throwError(() => error);
      })
    );
  }

  protected responseDeleteMany<T>(url: string, data: any): Observable<boolean> {
    const fullUrl = `${this.baseUrl}${url}`;
    const options: { headers?: HttpHeaders; params?: HttpParams; withCredentials?: boolean; body: any } = {
      ...this.addAuthHeader(),
      body: data
    };

    return this.http.request<T>('DELETE', fullUrl, options).pipe(
      map(() => true),
      catchError((error) => {
        console.error("Erreur de suppression multiple", error);
        return throwError(() => error);
      })
    );
  }


  protected responsePostMany<T>(url: string, data: any[]): Observable<T[]> {
    return this.post<T[]>(url, data).pipe(
      map(response => response ?? data),
      catchError((error) => {
        console.error("Erreur lors du POST multiple", error);
        return throwError(() => error);
      })
    );
  }

}
