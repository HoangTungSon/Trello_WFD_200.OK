import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IColor} from '../../otherInterface/iColor';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor(private httpClient: HttpClient) { }

  URL = apiUrl + '/colors';

  getColorById(id: number): Observable<IColor> {
    return this.httpClient.get<IColor>(`${this.URL}/${id}`);
  }

  getColors(count = 10): Observable<IColor[]> {
    return this.httpClient.get<IColor[]>(this.URL).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

  createColor(color: IColor): Observable<IColor> {
    return this.httpClient.post<IColor>(this.URL, color);
  }

  updateColor(color: IColor): Observable<IColor> {
    return this.httpClient.put<IColor>(`${this.URL}/${color.colorId}`, color);
  }

  deleteColor(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/${id}`);
  }

  getListColorByCard(count = 10, id: number): Observable<IColor[]> {
    return this.httpClient.get<IColor[]>(this.URL + '/card/' + id).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

  getColorByType(type: string): Observable<IColor> {
    return this.httpClient.get<IColor>(this.URL + '/type?type=' + type);
  }

}
