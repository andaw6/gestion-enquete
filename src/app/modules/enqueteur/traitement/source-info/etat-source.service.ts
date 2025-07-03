import { Injectable } from '@angular/core';
import {ApiService} from "@core/api/api.service";
import {HttpClient} from "@angular/common/http";
import {IParams} from "@core/interfaces/http-options.interface";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {EtatSourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";

@Injectable({
  providedIn: 'root'
})
export class EtatSourceService extends ApiService{

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/etat/source");
  }


  getAll(params?: IParams): Observable<ApiResponse<EtatSourceInfo>> {
    return this.responseGetMany<EtatSourceInfo>(params, "/all");
  }

  getOne(id: number): Observable<EtatSourceInfo | null> {
    return this.responseGetOne<EtatSourceInfo>(`/${id}`);
  }

  create(data: any): Observable<EtatSourceInfo> {
    const formData = new FormData();
    return this.responsePostOne<EtatSourceInfo>('', formData);
  }

  update(id: number, data: any): Observable<EtatSourceInfo> {
    return this.responsePutOne<EtatSourceInfo>(`/${id}`, data);
  }

  deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}
