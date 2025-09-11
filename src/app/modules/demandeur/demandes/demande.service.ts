import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiCrudService } from '@core/api/api-crud.service';
import { ApiResponse } from '@core/interfaces/api-response.interface';
import { map, Observable } from 'rxjs';
import { IParams } from '@core/interfaces/http-options.interface';
import {
  DemandeEnqueteModel,
  DemandeEnqueteStatEnquete,
  DemandeEnqueteStatEtat,
  DemandeEnqueteStat,
  DemandeEnqueteEvolution,
  DemandeEnqueteData,
  DemandeEtatDemande
} from '@core/model/demande-enquete.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeService extends ApiCrudService<DemandeEnqueteModel> {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/demande/enquete");
  }


  override getAll(params?: IParams): Observable<ApiResponse<DemandeEnqueteModel>> {
    return this.responseGetMany<DemandeEnqueteModel>(params, "/all");
  }

  override getOne(id: number): Observable<DemandeEnqueteModel | null> {
    return this.responseGetOne<DemandeEnqueteModel>(`/${id}`);
  }

  override create(data: DemandeEnqueteData): Observable<DemandeEnqueteModel> {
    return this.responsePostOne<DemandeEnqueteModel>(data);
  }

  override update(id: number, data: any): Observable<DemandeEnqueteModel> {
    return this.responsePutOne<DemandeEnqueteModel>(`/${id}`, data);
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }

  createWithDocument(data: { documents: File[], demande: DemandeEnqueteData }): Observable<DemandeEnqueteModel> {
    return this.responsePostOne<DemandeEnqueteModel>(this.toFormData(data), "/document");
  }


  updateWithDocument(id: number,data: { documents: File[], demande: DemandeEnqueteData }): Observable<DemandeEnqueteModel> {
    return this.responsePutOne<DemandeEnqueteModel>(`/${id}/document`, this.toFormData(data));
  }

  private toFormData(data: { documents: File[], demande: DemandeEnqueteData }) {
    const formData = new FormData();
    // Ajouter le champ demande en JSON
    formData.append('demande', JSON.stringify(data.demande));
    // Ajouter les fichiers
    data.documents.forEach(file => {
      formData.append('documents', file);
    });
    return formData;
  }


  validate(id: number): Observable<DemandeEnqueteModel> {
    return this.responsePatchOne<DemandeEnqueteModel>(`/${id}/etat`, null, { code: "01" });
  }

  changeEtat(id: number, code: DemandeEtatDemande): Observable<DemandeEnqueteModel> {
    return this.responsePatchOne<DemandeEnqueteModel>(`/${id}/etat`, null, { code });
  }

  statsEtat(utilisateurId: number): Observable<DemandeEnqueteStatEtat> {
    return this.responseGetOne<DemandeEnqueteStatEtat>("/stats/etat", { utilisateurId }).pipe(map(d => d!));
  }

  statsEnquete(utilisateurId: number): Observable<DemandeEnqueteStatEnquete> {
    return this.responseGetOne<DemandeEnqueteStatEnquete>("/stats/enquete", { utilisateurId }).pipe(map(d => d!));
  }

  stats(utilisateurId: number): Observable<DemandeEnqueteStat> {
    return this.responseGetOne<DemandeEnqueteStat>("/stats", { utilisateurId }).pipe(map(d => d!));
  }

  evolution(id: number, date?: string): Observable<DemandeEnqueteEvolution[]> {
    return this.get<DemandeEnqueteEvolution[]>(`/stats/evolution/${id}`, { date });
  }
}
