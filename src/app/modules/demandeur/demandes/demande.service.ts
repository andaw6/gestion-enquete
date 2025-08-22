import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiCrudService } from '@core/api/api-crud.service';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { IParams } from '@core/interfaces/http-options.interface';
import { DemandeEnqueteModel } from '@core/model/demande-enquete.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeService extends ApiCrudService<DemandeEnqueteModel> {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/demande/enquete");
  }


  override getAll(params?: IParams): Observable<ApiResponse<DemandeEnqueteModel>> {
    return this.responseGetMany<DemandeEnqueteModel>(params, "/all");
  }

  override getOne(id: number): Observable<DemandeEnqueteModel | null> {
    return this.responseGetOne<DemandeEnqueteModel>(`/${id}`);
  }

  override create(data: any): Observable<DemandeEnqueteModel> {
    return this.responsePostOne<DemandeEnqueteModel>(data);
  }

  override update(id: number, data: any): Observable<DemandeEnqueteModel> {
    return this.responsePutOne<DemandeEnqueteModel>(`/${id}`, data);
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}
