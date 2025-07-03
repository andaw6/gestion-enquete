import { Injectable } from '@angular/core';
import {ApiService} from "@core/api/api.service";
import {IParams} from "@core/interfaces/http-options.interface";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {SourceInfo} from "@modules/enqueteur/traitement/source-info/source-info";

@Injectable({
  providedIn: 'root'
})
export abstract class ApiCrudService<T> extends ApiService{

  getAll(params?: IParams): Observable<ApiResponse<T>>;

  getOne(id: number): Observable<T | null>;

  create(data: any): Observable<T>;

  update(id: number, data: any): Observable<T>;

  deleteOne(id: number): Observable<boolean>;
}
