import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiCrudService } from '@core/api/api-crud.service';
import { Observable, of } from "rxjs";
import { map } from 'rxjs/operators';
import { IParams } from '@core/interfaces/http-options.interface';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { EnqueteModel } from '@core/model/enquete.model';

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
    return this.responsePostOne<EnqueteModel>(data).pipe(
      map(created => {
        return created;
      })
    );
  }

  override update(id: number, data: any): Observable<EnqueteModel> {
    return this.responsePutOne<EnqueteModel>(`/${id}`, data).pipe(
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

  override getAll(params: IParams = {}): Observable<ApiResponse<EnqueteModel>> {
    return this.responseGetMany<EnqueteModel>(params, "/all/avec/demande");
  }

  override getOne(id: number): Observable<EnqueteModel | null> {
    return this.responseGetOne<EnqueteModel>(`/${id}`);
  }
}
