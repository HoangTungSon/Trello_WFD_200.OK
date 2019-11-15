import { Component, OnInit } from '@angular/core';
import {SignUpInfo} from '../auth/sign-up-info';
import {AuthService} from '../auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form = new FormGroup({
    username: new FormControl('', [ Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  });
  signupInfo: SignUpInfo;
  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = '';

  isNotSignUp = 'Wrong username or password !!!';
  displaySignUp = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [ Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  onSubmit() {

    const {username, email , password} = this.form.value;

    this.signupInfo = new SignUpInfo(username, email, password);

    this.authService.signUp(this.signupInfo).subscribe(
      data => {
        console.log(data);
        this.isSignedUp = true;
        this.isSignUpFailed = false;
      },
      error => {
        this.errorMessage = error.error.message;
        this.isSignUpFailed = true;
        this.displaySignUp = true;
      }
    );
  }
}
