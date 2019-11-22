import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {ICard} from '../icard';
import {environment} from '../../../environments/environment.prod';
<<<<<<< HEAD
import {SearchCardForm} from '../../login-taskbar/search-card-form';
=======
import {SearchByTitleOrDescription} from '../../login-taskbar/Form/search-by-title-or-description';
>>>>>>> 7e783906be7a929c5014c9c706d0529cdbf6c91b

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private httpClient: HttpClient) {
  }

  URL = apiUrl + '/cards';

  getCardById(id: number): Observable<ICard> {
    return this.httpClient.get<ICard>(`${this.URL}/${id}`);
  }

  getCard(count = 10): Observable<ICard[]> {
    return this.httpClient.get<ICard[]>(this.URL).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

  createCard(card: ICard): Observable<ICard> {
    return this.httpClient.post<ICard>(this.URL, card);
  }

  updateCard(card: ICard): Observable<ICard> {
    return this.httpClient.put<ICard>(`${this.URL}/${card.cardId}`, card);
  }

  deleteCard(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/${id}`);
  }

  getCardByList(count = 10, id: number): Observable<ICard[]> {
    return this.httpClient.get<ICard[]>(this.URL + '/list/' + id).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

<<<<<<< HEAD
  getSearchByTitleOrDescription(search: string): Observable<ICard[]> {
    return this.httpClient.get<ICard[]>(this.URL + '/searchCard?searchCardForm=' +  search);
  }

=======
  getSearchAllByTitleOrDescription(search: SearchByTitleOrDescription): Observable<ICard[]> {
    return this.httpClient.post<ICard[]>(this.URL + '/searchCard' , search);
  }
>>>>>>> 7e783906be7a929c5014c9c706d0529cdbf6c91b
}
