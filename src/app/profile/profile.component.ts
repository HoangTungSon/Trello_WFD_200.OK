import { Component, OnInit } from '@angular/core';
import {UserService} from '../user/service/user.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {IUser} from '../user/iuser';
import {TokenStorageService} from '../auth/token-storage.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SignUpInfo} from '../auth/sign-up-info';
import {PassForm} from './pass-form';
import {ChangePasswordService} from './service/change-password.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: IUser;
  info: any;
  pass: PassForm;
  isError = false;
  error = '';
  returnUrl: string;
  passForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cPassword: new FormControl('', [Validators.required, Validators.minLength(3)])
  });


  constructor(
    private userservice: UserService,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private changePasswordService: ChangePasswordService,
    private router: Router
  ) {
  }

  ngOnInit() {

    this.info = {
      userId: this.tokenStorage.getId(),
      email: this.tokenStorage.getEmail(),
      username: this.tokenStorage.getUsername(),
      token: this.tokenStorage.getToken(),
      role: [] = this.tokenStorage.getAuthorities()
    };
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/login';
  }

  updatePassword() {
    const {oldPassword, newPassword, cPassword} = this.passForm.value;
    if (newPassword !== cPassword) {
      this.isError = true;
      return this.error = 'Password confirm not match ';
    }
    const formPass = new PassForm(this.info.userId, this.info.username, oldPassword, newPassword);
    this.changePasswordService.onChangePassword(formPass).subscribe(
      result => {
        console.log(result);
        this.logout();
        this.router.navigateByUrl(this.returnUrl);
        alert('Change password successful. Please ReLogin !');
      }, error1 => {
        this.isError = true;
        this.error = 'Update password fail!';
        return console.log('error');
      }
    );
  }

  logout() {
    this.tokenStorage.signOut();
    this.router.navigateByUrl(this.returnUrl);
  }
}
