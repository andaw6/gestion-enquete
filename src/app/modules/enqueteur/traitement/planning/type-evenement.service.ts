import {Injectable} from '@angular/core';
import {ApiCrudService} from "@core/api/api-crud.service";
import {TypeEvenement} from "@modules/enqueteur/traitement/planning/planning";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from '@core/interfaces/api-response.interface';
import {IParams} from '@core/interfaces/http-options.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeEvenementService extends ApiCrudService<TypeEvenement> {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/type/evenement");
  }

  override getAll(params: IParams = {}): Observable<ApiResponse<TypeEvenement>> {
    return this.responseGetMany<TypeEvenement>(params, "/all");
  }

  override getOne(id: number): Observable<TypeEvenement | null> {
    return this.responseGetOne<TypeEvenement>(`/${id}`)
  }

  override create(data: any): Observable<TypeEvenement> {
    return this.responsePostOne<TypeEvenement>(data)
  }

  override update(id: number, data: any): Observable<TypeEvenement> {
    return this.responsePutOne<TypeEvenement>(`/${id}`, data);
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne<boolean>(`/${id}`);
  }

}
