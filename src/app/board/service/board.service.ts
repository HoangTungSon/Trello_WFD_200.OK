import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IBoard} from '../iboard';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private httpClient: HttpClient) {
  }

  URL = 'https://arcane-shelf-46327.herokuapp.com/boards';

  getBoardById(id: number): Observable<IBoard> {
    return this.httpClient.get<IBoard>(`${this.URL}/${id}`);
  }

  getBoard(count = 10): Observable<IBoard[]> {
    return this.httpClient.get<IBoard[]>(this.URL).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

  createBoard(board: IBoard): Observable<IBoard> {
    return this.httpClient.post<IBoard>(this.URL, board);
  }

  updateBoard(board: IBoard): Observable<IBoard> {
    return this.httpClient.put<IBoard>(`${this.URL}/${board.boardId}`, board);
  }

  deleteBoard(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/${id}`);
  }
}
