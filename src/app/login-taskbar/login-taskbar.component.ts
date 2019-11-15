import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-taskbar',
  templateUrl: './login-taskbar.component.html',
  styleUrls: ['./login-taskbar.component.css']
})
export class LoginTaskbarComponent implements OnInit {

  constructor(    private authService: AuthService,
                  private tokenStorage: TokenStorageService,
                  private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.tokenStorage.signOut();
    this.router.navigate(['/']);
    console.log(this.tokenStorage.getUsername());
  }

}
