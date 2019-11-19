import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthLoginInfo} from './auth-login-info';
import {Observable} from 'rxjs';
import {JwtResponse} from './jwt-response';
import {SignUpInfo} from './sign-up-info';
import {environment} from '../../environments/environment.prod';

const apiUrl = environment.apiUrl;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = apiUrl + '/users/signin';
  private signupUrl = apiUrl + '/users/signup';

  constructor(private http: HttpClient) {
  }

  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.loginUrl, credentials, httpOptions);
  }

  signUp(info: SignUpInfo): Observable<string> {
    return this.http.post<string>(this.signupUrl, info, httpOptions);
  }
}
