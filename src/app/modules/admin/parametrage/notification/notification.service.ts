import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiService} from '@core/api/api.service';
import {IParams} from '@core/interfaces/http-options.interface';
import {Notification, NotificationStats} from './notification';
import {ApiCrudService} from "@core/api/api-crud.service";


@Injectable({
  providedIn: 'root',
})
export class NotificationService extends ApiCrudService<Notification> {
  USER_ID = 1;

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl('/notification');
  }

  override getOne(id: number) {
    return this.responseGetOne<Notification>(`/${id}`);
  }

  getStats() {
    return this.responseGetOne<NotificationStats>(`/stats/${this.USER_ID}`);
  }

  override getAll(params: IParams = {}) {
    params['utilisateurId'] = this.USER_ID;
    return this.responseGetMany<Notification>(params, '/all');
  }

  getRead(params: IParams = {}) {
    params['utilistareurId'] = this.USER_ID;
    return this.responseGetMany<Notification>(params, '/all/read');
  }

  getUrgent(params: IParams = {}) {
    return this.responseGetMany<Notification>(params, '/all/urgent');
  }

  markRead(id: number) {
    return this.responsePostOne<Notification>(undefined, `/mark/read/${id}`,);
  }

  markManyRead(ids: number[]) {
    return this.responsePostMany<Notification>(`/mark/read/many`, ids);
  }

  getNotRead(params: IParams = {}) {
    params['utilisateurId'] = this.USER_ID;
    return this.responseGetMany<Notification>(params, '/all/not/read');
  }

  override create(data: Pick<Notification, 'message' | 'typeNotification'>) {
    let notif = {...data, utilisateurId: this.USER_ID};
    return this.responsePostOne<Notification>(notif);
  }

  override update(id: number, data: Pick<Notification, 'message' | 'typeNotification'>) {
    return this.responsePutOne<Notification>(`/${id}`, data);
  }

  override deleteOne(id: number) {
    return this.responseDeleteOne(`/${id}`);
  }

  deleteMany(list: number[]) {
    return this.responseDeleteMany('', list);
  }
}
