import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IFile} from '../IFile';


const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) {
  }

  URL = apiUrl + '/files';

  getFileById(id: number): Observable<IFile> {
    return this.httpClient.get<IFile>(`${this.URL}/${id}`);
  }

  getFile(count = 10): Observable<IFile[]> {
    return this.httpClient.get<IFile[]>(this.URL).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }

  createFile(file: IFile): Observable<IFile> {
    return this.httpClient.post<IFile>(this.URL, file);
  }

  updateCard(file: IFile): Observable<IFile> {
    return this.httpClient.put<IFile>(`${this.URL}/${file.id}`, file);
  }

  deleteCard(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/${id}`);
  }

  getFileByCard(count = 10, id: number): Observable<IFile[]> {
    return this.httpClient.get<IFile[]>(this.URL + '/card/' + id).pipe(
      map(data => data.filter((todo, i) => i < count))
    );
  }
}
