import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IComment} from '../icomment';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) {}

  URL = apiUrl + '/comments';

  getCommentById(id: number): Observable<IComment> {
    return this.httpClient.get<IComment>(`${this.URL}/${id}`);
  }

  getComment(count = 10): Observable<IComment[]> {
    return this.httpClient.get<IComment[]>(this.URL).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

  createComment(comment: Partial<IComment>): Observable<IComment> {
    return this.httpClient.post<IComment>(this.URL, comment);
  }

  updateComment(comment: IComment, id: number): Observable<IComment> {
    return this.httpClient.put<IComment>(`${this.URL}/${id}`, comment);
  }

  deleteComment(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/${id}`);
  }

  getListCommentByCard(count = 10, id: number): Observable<IComment[]> {
    return this.httpClient.get<IComment[]>(this.URL + '/card/' + id).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }
}
