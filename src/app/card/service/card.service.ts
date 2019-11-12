import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ICard} from '../icard';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private httpClient: HttpClient) {
  }

  URL = 'https://arcane-shelf-46327.herokuapp.com/cards';

  getCardById(id: number): Observable<ICard> {
    return this.httpClient.get<ICard>(`${this.URL}/${id}`);
  }

  getCard(count = 10): Observable<ICard[]> {
    return this.httpClient.get<ICard[]>(this.URL).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

  createCard(listCard: ICard): Observable<ICard> {
    return this.httpClient.post<ICard>(this.URL, listCard);
  }

  updateCard(listCard: ICard): Observable<ICard> {
    return this.httpClient.put<ICard>(`${this.URL}/${listCard.cardId}`, listCard);
  }

  deleteCard(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/${id}`);
  }

  getCardByList(count = 10, id: number): Observable<ICard[]> {
    return this.httpClient.get<ICard[]>(this.URL + '/list/' + id).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }
}
