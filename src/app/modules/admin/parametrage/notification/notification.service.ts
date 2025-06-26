import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { IParams } from '@core/interfaces/http-options.interface';
import {Notification, NotificationStats} from './notification';


@Injectable({
  providedIn: 'root',
})
export class NotificationService extends ApiService {
  USER_ID = 1;

  constructor(http: HttpClient) {
    super(http);
    this.setBaseUrl('/notification');
  }

  getOne(id: number) {
    return this.responseGetOne<Notification>(`/${id}`);
  }

  getStats(){
    return this.responseGetOne<NotificationStats>(`/stats/${this.USER_ID}`);
  }

  getAll(params: IParams = {}) {
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
    return this.responsePostOne<Notification>(`/mark/read/${id}`, null);
  }

  markManyRead(ids: number[]) {
    return this.responsePostMany<Notification>(`/mark/read/many`, ids);
  }

  getNotRead(params: IParams = {}) {
    params['utilisateurId'] = this.USER_ID;
    return this.responseGetMany<Notification>(params, '/all/not/read');
  }

  create(data: Pick<Notification, 'message' | 'typeNotification'>) {
    let notif = { ...data, utilisateurId: this.USER_ID };
    return this.responsePostOne<Notification>('', notif);
  }

  update(id: number, data: Pick<Notification, 'message' | 'typeNotification'>) {
    return this.responsePutOne<Notification>(`/${id}`, data);
  }

  deleteOne(id: number) {
    return this.responseDeleteOne(`/${id}`);
  }
   deleateMany(list:number[]){
    return this.responseDeleteMany('', list);
   }
}
