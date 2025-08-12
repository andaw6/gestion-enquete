import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiCrudService } from '@core/api/api-crud.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IParams } from '@core/interfaces/http-options.interface';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { DemandeEnquete } from './dashboard';


@Injectable({
  providedIn: 'root'
})
export class DashboardService extends ApiCrudService<DemandeEnquete> {

  readonly USER_ID: number = 1;



  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/demande/enquete");
  }

  /** CRUD API */
  override create(data: any): Observable<DemandeEnquete> {
    return this.responsePostOne<DemandeEnquete>(data).pipe(
      map(created => {
        return created;
      })
    );
  }

  override update(id: number, data: any): Observable<DemandeEnquete> {
    return this.responsePutOne<DemandeEnquete>(`/${id}`, data).pipe(
      map(updated => {
        return updated;
      })
    );
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`).pipe(
      map(success => {
        return success;
      })
    );
  }

  override getAll(params: IParams = {}): Observable<ApiResponse<DemandeEnquete>> {
    params["utilisateurId"] = this.USER_ID;
    return this.responseGetMany<DemandeEnquete>(params, "/all");
  }

  override getOne(id: number): Observable<DemandeEnquete | null> {
    return this.responseGetOne<DemandeEnquete>(`/${id}`);
  }

}
