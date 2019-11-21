import {Component, OnInit} from '@angular/core';
import {SignUpInfo} from '../auth/sign-up-info';
import {AuthService} from '../auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cpassword: new FormControl('', [Validators.required, Validators.minLength(3)])
  });
  signupInfo: SignUpInfo;
  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = '';
  successSignUp = false;

  isNotSignUp = 'Wrong username or password !!!';
  displaySignUp = false;

  message = 'The passwords do not match';
  displayMessage = false;

  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cpassword: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  onSubmit() {

    const {username, email, password, cpassword} = this.form.value;
    this.signupInfo = new SignUpInfo(username, email, password);

    if (password === cpassword) {
      this.authService.signUp(this.signupInfo).subscribe(
        data => {
          this.isSignedUp = true;
          this.isSignUpFailed = false;
          this.successSignUp = true;
          this.router.navigate(['/login']).then(r =>
            console.log(data)
          );
        },
        error => {
          this.errorMessage = error.error.message;
          this.isSignUpFailed = true;
          this.displaySignUp = true;
        }
      );
    } else {
      this.displayMessage = true;
    }


  }
}
