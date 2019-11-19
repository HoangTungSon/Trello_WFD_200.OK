import { Component, OnInit } from '@angular/core';
import {UserService} from '../user/service/user.service';
import {ActivatedRoute} from '@angular/router';
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
  passForm = new FormGroup({
    userId: new FormControl(this.tokenStorage.getId(), [Validators.required, Validators.minLength(3)]),
    username: new FormControl(this.tokenStorage.getUsername(), [Validators.required, Validators.minLength(3)]),
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cPassword: new FormControl('', [Validators.required, Validators.minLength(3)])
  });


  constructor(
    private userservice: UserService,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private changePasswordService: ChangePasswordService
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

    const id = +this.route.snapshot.paramMap.get('id');
    this.userservice.getUserById(id).subscribe(
      next => {
        this.user = next;
        console.log('get user successfully');
      }, error => {
        console.log('get user error');
      }
    );
  }

  onChange() {
    const {userId, username, oldPassword, newPassword, cPassword} = this.passForm.value;
    this.pass = new PassForm(userId, username, oldPassword, newPassword);

    if (newPassword === cPassword) {
      this.changePasswordService.onChangePassword(this.pass).subscribe(
        data => {
          console.log(data);
          console.log('thanh cong');
        },
        error => {
          console.log('that bai');
        }
      );
    } else {
      console.log('mat khau khong dung');
    }
  }
}
