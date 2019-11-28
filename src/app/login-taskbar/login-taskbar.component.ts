import {Component, Input, OnInit} from '@angular/core';
import {TokenStorageService} from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {CardService} from '../card/service/card.service';
import {SearchCardService} from '../card/service/search-card.service';
import {IUser} from '../user/iuser';
import {UserService} from '../user/service/user.service';
import {ICard} from '../card/icard';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login-taskbar',
  templateUrl: './login-taskbar.component.html',
  styleUrls: ['./login-taskbar.component.css']
})
export class LoginTaskbarComponent implements OnInit {
  searchText: string;
  user: IUser;
  cardsNotification: ICard[] = [];
  userId: number;
  colors: string[] = [];

  input1 = true;
  input2 = true;
  input3 = true;
  input4 = true;
  input5 = true;

  color1 = '#2883e9';
  color2 = '#e920e9';
  color3 = '#e4E925';
  color4 = '#eC4040';
  color5 = '#2DD02D';

  colorForm: FormGroup = new FormGroup({
    input1: new FormControl(''),
    input2: new FormControl(''),
    input3: new FormControl(''),
    input4: new FormControl(''),
    input5: new FormControl(''),
  });


  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private cardService: CardService,
              private searchCardService: SearchCardService,
              private userService: UserService
  ) {
  }

  ngOnInit() {
    this.userId = +this.tokenStorage.getId();
    const id = +this.tokenStorage.getId();
    this.userService.getUserById(id).subscribe(next => {
      this.user = next;
      console.log(this.user);
      console.log('success get user for taskbar');
      for (const cardId of this.user.cardNoti) {
        this.cardService.getCardById(cardId).subscribe(success => {
          this.cardsNotification.push(success);
          console.log('success push cardNoti to array');
        }, error => {
          console.log('fail to push cardNoti to array');
        });
      }
    }, error => {
      console.log('fail to get user for taskbar');
    });
  }

  onSubmit() {
    this.tokenStorage.signOut();
    this.router.navigate(['/']);
    console.log(this.tokenStorage.getUsername());
  }

  onClick() {
    this.router.navigate(['/user/' + this.tokenStorage.getId() + '/board']);
  }

  onSearchComplete() {
    this.searchCardService.send(this.searchText);
  }

  deleteAllCardNoti() {
    this.user.cardNoti = [];
    this.userService.updateUser(this.user).subscribe(next => {
      console.log('marked all read');
    }, error => {
      console.log('cannot marked all');
    });
  }

  onSearchLabel() {
    if (this.colorForm.value.input1) {
      this.colors.push(this.color1);
    }

    if (this.colorForm.value.input2) {
      this.colors.push(this.color2);
    }

    if (this.colorForm.value.input3) {
      this.colors.push(this.color3);
    }

    if (this.colorForm.value.input4) {
      this.colors.push(this.color4);
    }

    if (this.colorForm.value.input5) {
      this.colors.push(this.color5);
    }

    console.log(this.colors);

    this.searchCardService.sendLabel(this.colors);
  }


}
