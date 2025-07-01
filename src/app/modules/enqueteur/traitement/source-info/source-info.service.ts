import { Injectable } from '@angular/core';
import {ApiService} from "@core/api/api.service";
import {HttpClient} from "@angular/common/http";
import {IParams} from "@core/interfaces/http-options.interface";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";

@Injectable({
  providedIn: 'root'
})
export class SourceInfoService extends ApiService{

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/source/info");
  }


  getAll(params?: IParams): Observable<ApiResponse<SourceInfo>> {
    return this.responseGetMany<SourceInfo>(params, "/all");
  }

  getOne(id: number): Observable<SourceInfo | null> {
    return this.responseGetOne<SourceInfo>(`/${id}`);
  }

  create(data: any): Observable<SourceInfo> {
    const formData = new FormData();
    return this.responsePostOne<SourceInfo>('', formData);
  }

  update(id: number, data: any): Observable<SourceInfo> {
    return this.responsePutOne<SourceInfo>(`/${id}`, data);
  }

  deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}
