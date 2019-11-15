import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IBoard} from '../../board/iboard';
import {map} from 'rxjs/operators';
import {IUser} from '../iuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  URL = 'https://arcane-shelf-46327.herokuapp.com/users';

  getUserById(id: number): Observable<IUser> {
    return this.httpClient.get<IUser>(`${this.URL}/${id}`);
  }

  getUser(count = 10): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(this.URL).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

  createUser(user: IUser): Observable<IUser> {
    return this.httpClient.post<IUser>(this.URL, user);
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.httpClient.put<IUser>(`${this.URL}/${user.userId}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/${id}`);
  }
}