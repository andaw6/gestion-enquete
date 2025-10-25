import { Injectable } from '@angular/core';
import { ApiCrudService } from '@core/api/api-crud.service';
import {HttpClient} from "@angular/common/http";
import {IParams} from "@core/interfaces/http-options.interface";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import { ConcerneModel } from '@core/model/concerne.model';


@Injectable({
  providedIn: 'root'
})
export class ConcerneService extends ApiCrudService<ConcerneModel>{

constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/concerne");
  }


  override getAll(params?: IParams): Observable<ApiResponse<ConcerneModel>> {
    return this.responseGetMany<ConcerneModel>(params, "/all");
  }

  override getOne(id: number): Observable<ConcerneModel | null> {
    return this.responseGetOne<ConcerneModel>(`/${id}`);
  }

  override create(data: any): Observable<ConcerneModel> {
    const formData = new FormData();
    return this.responsePostOne<ConcerneModel>(formData);
  }

  override update(id: number, data: any): Observable<ConcerneModel> {
    return this.responsePutOne<ConcerneModel>(`/${id}`, data);
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}
