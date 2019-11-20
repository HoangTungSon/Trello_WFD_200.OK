import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IListCard} from '../ilist-card';

@Injectable({
  providedIn: 'root'
})
export class ListCardService {

  constructor(private httpClient: HttpClient) {
  }

  URL = 'https://arcane-shelf-46327.herokuapp.com/lists';

  getListCardById(id: number): Observable<IListCard> {
    return this.httpClient.get<IListCard>(`${this.URL}/${id}`);
  }

  getListCard(count = 10): Observable<IListCard[]> {
    return this.httpClient.get<IListCard[]>(this.URL).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

  createListCard(listCard: IListCard): Observable<IListCard> {
    return this.httpClient.post<IListCard>(this.URL, listCard);
  }

  updateListCard(listCard: IListCard, id: number): Observable<IListCard> {
    return this.httpClient.put<IListCard>(`${this.URL}/${id}`, listCard);
  }

  deleteListCard(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/${id}`);
  }


  getListCardByBoard(count = 10, id: string): Observable<IListCard[]> {
    return this.httpClient.get<IListCard[]>( this.URL + '/board/' + id).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }
}
