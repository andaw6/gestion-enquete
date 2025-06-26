import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IParams} from "@core/interfaces/http-options.interface";
import {ApiService} from "@core/api/api.service";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {EtatDemande} from "@modules/admin/parametrage/etat-demande/etat-demande";

@Injectable({
  providedIn: 'root'
})
export class EtatDemandeService extends ApiService{

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

  create(data: Pick<EtatDemande, 'code' | 'libelle'>): Observable<EtatDemande> {
    return this.responsePostOne<EtatDemande>('', data);
  }

  update(id: number, data: Pick<EtatDemande, 'code' | 'libelle'>): Observable<EtatDemande> {
    return this.responsePutOne<EtatDemande>(`/${id}`, data);
  }

  deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}
