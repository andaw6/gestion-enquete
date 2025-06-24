import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiService} from '@core/api/api.service';
import {IParams} from '@core/interfaces/http-options.interface';
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {TypeDocument} from "@modules/admin/parametrage/type-document/type-document";

@Injectable({
  providedIn: 'root'
})
export class TypeDocumentService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/type/document");
  }

  getAll(params?: IParams): Observable<ApiResponse<TypeDocument>> {
    return this.responseGetMany<TypeDocument>(params, "/all");
  }

  getOne(id: number): Observable<TypeDocument | null> {
    return this.responseGetOne<TypeDocument>(`/${id}`);
  }

  create(data: Pick<TypeDocument, 'code' | 'libelle'>): Observable<TypeDocument> {
    return this.responsePostOne<TypeDocument>('', data);
  }

  update(id: number, data: Pick<TypeDocument, 'code' | 'libelle'>): Observable<TypeDocument> {
    return this.responsePutOne<TypeDocument>(`/${id}`, data);
  }

  deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}
