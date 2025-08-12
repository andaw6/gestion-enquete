import { Injectable } from '@angular/core';
import {ApiCrudService} from "@core/api/api-crud.service";
import {Utilisateur} from "@core/interfaces/utilisateur.interface";
import {Observable, of} from "rxjs";
import {IParams} from "@core/interfaces/http-options.interface";
import {ApiResponse} from "@core/interfaces/api-response.interface";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService extends ApiCrudService<Utilisateur>{

  constructor(http: HttpClient) {
    super(http);
  }

  override create(data: any): Observable<Utilisateur> {
    return of();
  }

  override deleteOne(id: number): Observable<boolean> {
    return of();
  }

  override getAll(params: IParams | undefined): Observable<ApiResponse<Utilisateur>> {
    return of();
  }

  override getOne(id: number): Observable<Utilisateur | null> {
    return of();
  }

  override update(id: number, data: any): Observable<Utilisateur> {
    return of();
  }
}
