import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiCrudService } from '@core/api/api-crud.service';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { IParams } from '@core/interfaces/http-options.interface';
import { AutreInfoModel } from '@core/model/autre-info.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutreInfoService  extends ApiCrudService<AutreInfoModel> {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/autre/info");
  }

  /** CRUD API */
  override create(data: any): Observable<AutreInfoModel> {
    return this.responsePostOne<AutreInfoModel>(data);
  }

  override update(id: number, data: any): Observable<AutreInfoModel> {
    return this.responsePutOne<AutreInfoModel>(`/${id}`, data);
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }

  override getAll(params: IParams = {}): Observable<ApiResponse<AutreInfoModel>> {
    return this.responseGetMany<AutreInfoModel>(params, "/all");
  }

  override getOne(id: number): Observable<AutreInfoModel | null> {
    return this.responseGetOne<AutreInfoModel>(`/${id}`);
  }
}
