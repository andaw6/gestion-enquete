import { Injectable } from '@angular/core';
import {ApiService} from "@core/api/api.service";
import {HttpClient} from "@angular/common/http";
import {IParams} from "@core/interfaces/http-options.interface";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {EtatEnquete} from "@modules/admin/parametrage/etat-enquete/etat-enquete";

@Injectable({
  providedIn: 'root'
})
export class EtatEnqueteService extends ApiService{

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/etat/enquete");
  }

  getAll(params?: IParams): Observable<ApiResponse<EtatEnquete>> {
    return this.responseGetMany<EtatEnquete>(params, "/all");
  }

  getOne(id: number): Observable<EtatEnquete | null> {
    return this.responseGetOne<EtatEnquete>(`/${id}`);
  }

  create(data: Pick<EtatEnquete, 'code' | 'libelle'>): Observable<EtatEnquete> {
    return this.responsePostOne<EtatEnquete>('', data);
  }

  update(id: number, data: Pick<EtatEnquete, 'code' | 'libelle'>): Observable<EtatEnquete> {
    return this.responsePutOne<EtatEnquete>(`/${id}`, data);
  }

  deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}
