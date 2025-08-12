import {Injectable} from "@angular/core";
import {ApiService} from "@core/api/api.service";
import {HttpClient} from "@angular/common/http";
import {IParams} from "@core/interfaces/http-options.interface";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface"
import {TypeSource} from "@modules/admin/parametrage/type-source/type-source";
import {ApiCrudService} from "@core/api/api-crud.service";

@Injectable({
  providedIn: 'root'
})
export class TypeSourceService extends ApiCrudService<TypeSource> {
  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl("/type/source");
  }


  override getAll(params: IParams = {}): Observable<ApiResponse<TypeSource>> {
    return this.responseGetMany<TypeSource>(params, "/all");
  }

  override getOne(id: number): Observable<TypeSource | null> {
    return this.responseGetOne<TypeSource>(`/${id}`);
  }

  override create(data: Pick<TypeSource, 'code' | 'libelle'>): Observable<TypeSource> {
    return this.responsePostOne<TypeSource>(data);
  }

  override update(id: number, data: Pick<TypeSource, 'code' | 'libelle'>): Observable<TypeSource> {
    return this.responsePutOne<TypeSource>(`/${id}`, data);
  }

  override deleteOne(id: number): Observable<boolean> {
    return this.responseDeleteOne(`/${id}`);
  }
}
