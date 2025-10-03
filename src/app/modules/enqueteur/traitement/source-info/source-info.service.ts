import { Injectable } from '@angular/core';
import { ApiService } from "@core/api/api.service";
import { HttpClient } from "@angular/common/http";
import { IParams } from "@core/interfaces/http-options.interface";
import { Observable } from "rxjs";
import { ApiResponse } from "@core/interfaces/api-response.interface";
import { SourceInfoModel, SourceInfoRequestData } from '@core/model/source-info.model';

type SourceType = { files: File[], source: SourceInfoRequestData };


@Injectable({
  providedIn: 'root'
})
export class SourceInfoService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/source/info");
  }


  getAll(params?: IParams): Observable<ApiResponse<SourceInfoModel>> {
    return this.responseGetMany<SourceInfoModel>(params, "/all");
  }

  getOne(id: number): Observable<SourceInfoModel | null> {
    return this.responseGetOne<SourceInfoModel>(`/${id}`);
  }

  create(data: SourceType): Observable<SourceInfoModel> {
    return this.responsePostOne<SourceInfoModel>(this.toFormData(data));
  }


  update(id: number, data: SourceType): Observable<SourceInfoModel> {
    return this.responsePutOne<SourceInfoModel>(`/${id}`, this.toFormData(data));
  }

  deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }

  private toFormData(data: SourceType): FormData {
    const formData = new FormData();

    // Ajouter les fichiers
    if (data.files && data.files.length > 0) {
      data.files.forEach(file => {
        formData.append('files', file, file.name);
      });
    }

    // Convertir les dates en string ISO si nécessaire
    const {id, ...sourceCopy} = { ...data.source };

    // S'assurer que les dates sont au format ISO complet pour LocalDateTime
    if (sourceCopy.dateObtention) {
      const dateObtention = new Date(sourceCopy.dateObtention);
      sourceCopy.dateObtention = dateObtention.toISOString();
    }

    if (sourceCopy.dateMiseAJour) {
      const dateMiseAJour = new Date(sourceCopy.dateMiseAJour);
      sourceCopy.dateMiseAJour = dateMiseAJour.toISOString();
    }

    // Ajouter la source au FormData
    formData.append('source', JSON.stringify(sourceCopy));


    return formData;
  }
}
