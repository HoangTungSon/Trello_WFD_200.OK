import {Component, OnInit} from '@angular/core';
import {AuthLoginInfo} from '../auth/auth-login-info';
import {AuthService} from '../auth/auth.service';
import {TokenStorageService} from '../auth/token-storage.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  isNotLogin = 'Wrong username or password !!!';
  display = false;

  private loginInfo: AuthLoginInfo;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router) {
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getAuthorities();
      console.log(this.isLoggedIn);
    }
    this.form = {
      userId: this.tokenStorage.getId(),
      email: this.tokenStorage.getEmail(),
      username: this.tokenStorage.getUsername(),
      token: this.tokenStorage.getToken(),
      role: [] = this.tokenStorage.getAuthorities()
    };

    console.log(this.form);
  }

  onSubmit() {
    const {username, password} = this.loginForm.value;

    const loginFormAuth = new AuthLoginInfo(username, password);
    console.log(username);
    console.log(this.roles);

    this.authService.attemptAuth(loginFormAuth).subscribe(
      data => {

        this.tokenStorage.saveId(data.userId);
        this.tokenStorage.saveEmail(data.email);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.roles);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getAuthorities();
        this.router.navigate(['/user/' + data.userId + '/board']);
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
        this.display = true;
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }
}
