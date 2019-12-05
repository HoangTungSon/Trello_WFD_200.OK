import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {INotification} from '../../otherInterface/iNotification';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient: HttpClient) { }

  URL = apiUrl + '/notifications';

  getNotiById(id: number): Observable<INotification> {
    return this.httpClient.get<INotification>(`${this.URL}/${id}`);
  }

  getNotifications(count = 10): Observable<INotification[]> {
    return this.httpClient.get<INotification[]>(this.URL).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

  createNotification(notification: INotification): Observable<INotification> {
    return this.httpClient.post<INotification>(this.URL, notification);
  }

  updateNotification(notification: INotification): Observable<INotification> {
    return this.httpClient.put<INotification>(`${this.URL}/${notification.id}`, notification);
  }

  deleteNotification(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/${id}`);
  }

  getListNotificationByUser(count = 10, id: number): Observable<INotification[]> {
    return this.httpClient.get<INotification[]>(this.URL + '/user/' + id).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }


}
