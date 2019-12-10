import {Component, OnInit} from '@angular/core';
import {UserService} from '../user/service/user.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {IUser} from '../user/iuser';
import {TokenStorageService} from '../auth/token-storage.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SignUpInfo} from '../auth/sign-up-info';
import {PassForm} from './pass-form';
import {ChangePasswordService} from './service/change-password.service';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {finalize, tap} from 'rxjs/operators';
import * as firebase from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: IUser;
  userInfo: IUser;
  info: any;
  isError = false;
  error = '';
  returnUrl: string;
  passForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cPassword: new FormControl('', [Validators.required, Validators.minLength(3)])
  });


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private changePasswordService: ChangePasswordService,
    private router: Router
  ) {
  }


  ngOnInit() {
    // const id = +this.tokenStorage.getId();
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(id).subscribe(next => {
      this.userInfo = next;
      console.log('success to get user');
    }, error1 => {
      console.log('fail to get user');
    });
    const fileSelect = document.getElementById('fileSelect');
    const fileElem = document.getElementById('fileElem');

    fileSelect.addEventListener('click', next => {
      if (fileElem) {
        fileElem.click();
      }
    }, false);

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

  startUpload(file: File) {
    const metadata = {
      contentType: 'image/jpg'
    };
    const storageRef = firebase.storage().ref();
    const fileImage = storageRef.child('image/' + file.name).put(file, metadata);
    storageRef.child(file.name).getDownloadURL().then(url => {
      console.log(url);
    });
    fileImage.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('upload is ' + progress + ' % done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('upload is paused');
            break;
        }
      }, errors => {
        switch (errors.message) {
          case 'storage/unauthorized':
            console.log('unauthorized');
            break;
          case 'storage/canceled':
            console.log('cancel upload');
            break;
          case 'storage/unknown':
            console.log('unknown');
            break;
        }
      }, () => {
      fileImage.snapshot.ref.getDownloadURL().then(downloadURl => {
        console.log('file available at: ' + downloadURl);
        const id = +this.tokenStorage.getId();
        this.userService.getUserById(id).subscribe(next => {
          console.log('success get user');
          this.userInfo = next;
          this.userInfo.avatarLink = downloadURl;
          this.userService.updateUser(this.userInfo).subscribe(success => {
            console.log('success update user');
          }, error1 => {
            console.log('fail to update user');
          });
        }, error1 => {
          console.log('fail to get user');
        });
      });
      });
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  onFileSelect(event) {
    console.log(event.target.files[0].name);
    this.startUpload(event.target.files[0]);
  }


  // -------------------------- Logout -----------------------------
  onLogout() {
      this.tokenStorage.signOut();
      this.router.navigate(['/']);
      console.log(this.tokenStorage.getUsername());
    }

  onTranPageBoard() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/user/' + id + '/board']);
  }
}
