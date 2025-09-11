import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IParams} from "@core/interfaces/http-options.interface";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import { DocumentData, DocumentUrl} from "@modules/enqueteur/traitement/document/document";
import {ApiCrudService} from "@core/api/api-crud.service";
import { DocumentModel } from '@core/model/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends ApiCrudService<DocumentModel, DocumentData> {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/documents")
  }

  getBlob(documentId: number): Observable<Blob> {
    return this.http.get(`/api/documents/${documentId}/view`, {
      responseType: 'blob'
    });
  }

  override getAll(params: IParams= {}): Observable<ApiResponse<DocumentModel>> {
    return this.responseGetMany<DocumentModel>(params, "/all");
  }

  override getOne(id: number): Observable<DocumentModel | null> {
    return this.responseGetOne<DocumentModel>(`/${id}`);
  }

  override create(data: DocumentData): Observable<DocumentModel> {
    return this.responsePostOne<DocumentModel>(this.toFormData(data));
  }

  private toFormData(data:DocumentData):FormData{
    const formData = new FormData();
    formData.append("nom", data.nom);
    formData.append("description", data.description);
    formData.append("typeId", data.typeId.toString());
    formData.append("file", data.file);
    if(data.utilisateurId){
      formData.append("utilisateurId", data.utilisateurId.toString());
    }
    return formData;
  }

  override update(id: number, data: DocumentData): Observable<DocumentModel> {
    return this.responsePutOne<DocumentModel>(`/${id}`, data);
  }

  override deleteOne(id: number): Observable<boolean> {
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
