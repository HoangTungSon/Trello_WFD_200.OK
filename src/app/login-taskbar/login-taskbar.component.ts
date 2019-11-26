import {Component, Input, OnInit} from '@angular/core';
import {TokenStorageService} from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {CardService} from '../card/service/card.service';
import {SearchCardService} from '../card/service/search-card.service';
import {IUser} from '../user/iuser';
import {UserService} from '../user/service/user.service';
import {ICard} from '../card/icard';

@Component({
  selector: 'app-login-taskbar',
  templateUrl: './login-taskbar.component.html',
  styleUrls: ['./login-taskbar.component.css']
})
export class LoginTaskbarComponent implements OnInit {
  searchText: string;
  user: IUser;
  cardsNotification: ICard[] = [];

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private cardService: CardService,
              private searchCardService: SearchCardService,
              private userService: UserService
  ) {
  }

  ngOnInit() {
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

}
