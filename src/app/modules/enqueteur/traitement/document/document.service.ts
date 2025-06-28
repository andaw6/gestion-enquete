import {Injectable} from '@angular/core';
import {ApiService} from "@core/api/api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IParams} from "@core/interfaces/http-options.interface";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {Document, DocumentUrl} from "@modules/enqueteur/traitement/document/document";

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/documents")
  }

  getBlob(documentId: number): Observable<Blob> {
    return this.http.get(`/api/documents/${documentId}/view`, {
      responseType: 'blob'
    });
  }

  getAll(params?: IParams): Observable<ApiResponse<Document>> {
    return this.responseGetMany<Document>(params, "/all");
  }

  getOne(id: number): Observable<Document | null> {
    return this.responseGetOne<Document>(`/${id}`);
  }

  create(data: any): Observable<Document> {
    return this.responsePostOne<Document>('', data);
  }

  update(id: number, data: any): Observable<Document> {
    return this.responsePutOne<Document>(`/${id}`, data);
  }

  deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }

  getUrl(id: number): Observable<DocumentUrl | null> {
    return this.responseGetOne<DocumentUrl>(`/${id}/url`);
  }

  getView(id: number, params: IParams = {}): Observable<any> {
    let fullUrl = `${this.baseUrl}/${id}/view`;
    if (params) {
      fullUrl += `?${this.formatQueryParams(params)}`;
    }
    return this.http.get(fullUrl, {
      responseType: 'blob'
    });
  }
}
