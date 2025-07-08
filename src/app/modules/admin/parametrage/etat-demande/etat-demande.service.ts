import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IParams} from "@core/interfaces/http-options.interface";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {EtatDemande, EtatDemandeData} from "@modules/admin/parametrage/etat-demande/etat-demande";
import {ApiCrudService} from "@core/api/api-crud.service";

@Injectable({
  providedIn: 'root'
})
export class EtatDemandeService extends ApiCrudService<EtatDemande, EtatDemandeData>{

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/etat/demande");
  }

  getAll(params?: IParams): Observable<ApiResponse<EtatDemande>> {
    return this.responseGetMany<EtatDemande>(params, "/all");
  }

  getOne(id: number): Observable<EtatDemande | null> {
    return this.responseGetOne<EtatDemande>(`/${id}`);
  }

  create(data: EtatDemandeData): Observable<EtatDemande> {
    return this.responsePostOne<EtatDemande>('', data);
  }

  update(id: number, data: EtatDemandeData): Observable<EtatDemande> {
    return this.responsePutOne<EtatDemande>(`/${id}`, data);
  }

  deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}

