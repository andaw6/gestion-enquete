import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiCrudService } from '@core/api/api-crud.service';
import { map, Observable } from "rxjs";
import { IParams } from '@core/interfaces/http-options.interface';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { EnqueteEtatEnquete, EnqueteModel, EnqueteStatEtat } from '@core/model/enquete.model';

@Injectable({
  providedIn: 'root'
})
export class EnqueteService extends ApiCrudService<EnqueteModel> {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/enquete");
  }

  /** CRUD API */
  override create(data: any): Observable<EnqueteModel> {
    return this.responsePostOne<EnqueteModel>(data);
  }

  override update(id: number, data: any): Observable<EnqueteModel> {
    return this.responsePutOne<EnqueteModel>(`/${id}`, data);
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }

  override getAll(params: IParams = {}): Observable<ApiResponse<EnqueteModel>> {
    return this.responseGetMany<EnqueteModel>(params, "/all/avec/demande");
  }

  override getOne(id: number): Observable<EnqueteModel | null> {
    return this.responseGetOne<EnqueteModel>(`/${id}`);
  }

  changeEtat(id: number, code: EnqueteEtatEnquete): Observable<EnqueteModel> {
    return this.responsePatchOne<EnqueteModel>(`/${id}/etat`, null, { code });
  }

  statsEtat(utilisateurId?: number): Observable<EnqueteStatEtat> {
    return this.responseGetOne<EnqueteStatEtat>("/stats/etat", { utilisateurId }).pipe(map(d => d!));
  }


}
