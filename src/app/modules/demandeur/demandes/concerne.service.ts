import { Injectable } from '@angular/core';
import { ApiCrudService } from '@core/api/api-crud.service';
import {HttpClient} from "@angular/common/http";
import {IParams} from "@core/interfaces/http-options.interface";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import { Concerne } from './model';


@Injectable({
  providedIn: 'root'
})
export class ConcerneService extends ApiCrudService<Concerne>{

constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/concerne");
  }


  override getAll(params?: IParams): Observable<ApiResponse<Concerne>> {
    return this.responseGetMany<Concerne>(params, "/all");
  }

  override getOne(id: number): Observable<Concerne | null> {
    return this.responseGetOne<Concerne>(`/${id}`);
  }

  override create(data: any): Observable<Concerne> {
    const formData = new FormData();
    return this.responsePostOne<Concerne>(formData);
  }

  override update(id: number, data: any): Observable<Concerne> {
    return this.responsePutOne<Concerne>(`/${id}`, data);
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}
