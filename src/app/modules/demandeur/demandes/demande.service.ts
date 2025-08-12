import { Injectable } from '@angular/core';
import { DemandeEnquete } from '../dashboard/dashboard';
import { HttpClient } from '@angular/common/http';
import { ApiCrudService } from '@core/api/api-crud.service';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { IParams } from '@core/interfaces/http-options.interface';
import { DemandeEnqueteData } from './model';

@Injectable({
  providedIn: 'root'
})
export class DemandeService extends ApiCrudService<DemandeEnquete> {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/demande/enquete");
  }


  override getAll(params?: IParams): Observable<ApiResponse<DemandeEnquete>> {
    return this.responseGetMany<DemandeEnquete>(params, "/all");
  }

  override getOne(id: number): Observable<DemandeEnquete | null> {
    return this.responseGetOne<DemandeEnquete>(`/${id}`);
  }

  override create(data: DemandeEnqueteData): Observable<DemandeEnquete> {
    return this.responsePostOne<DemandeEnquete>(data);
  }

  override update(id: number, data: any): Observable<DemandeEnquete> {
    return this.responsePutOne<DemandeEnquete>(`/${id}`, data);
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}
