import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IUser} from '../../user/iuser';
import {Observable} from 'rxjs';
import {PassForm} from '../pass-form';
import {environment} from '../../../environments/environment.prod';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {


  URL = apiUrl + '/users/update-password';

  constructor(private http: HttpClient) { }


  onChangePassword(pass: PassForm): Observable<PassForm> {
    return this.http.put<PassForm>(`${this.URL}/${pass.userId}`, pass);
  }

}
