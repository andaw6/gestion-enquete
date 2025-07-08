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

  create(data: any): Observable<Utilisateur> {
    return of();
  }

  deleteOne(id: number): Observable<boolean> {
    return of();
  }

  getAll(params: IParams | undefined): Observable<ApiResponse<Utilisateur>> {
    return of();
  }

  getOne(id: number): Observable<Utilisateur | null> {
    return of();
  }

  update(id: number, data: any): Observable<Utilisateur> {
    return of();
  }
}
