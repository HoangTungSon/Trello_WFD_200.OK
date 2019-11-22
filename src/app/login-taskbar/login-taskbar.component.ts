import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TokenStorageService} from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user/service/user.service';
import {IUser} from '../user/iuser';
import {CardService} from '../card/service/card.service';
import {SearchCardForm} from './search-card-form';
import {ICard} from '../card/icard';
import {SearchCardService} from '../card/service/search-card.service';

@Component({
  selector: 'app-login-taskbar',
  templateUrl: './login-taskbar.component.html',
  styleUrls: ['./login-taskbar.component.css']
})
export class LoginTaskbarComponent implements OnInit {

  searchForm: any;
  private cardList: ICard[];

  constructor(    private authService: AuthService,
                  private tokenStorage: TokenStorageService,
                  private router: Router,
                  private cardService: CardService,
                  private searchCardService: SearchCardService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.tokenStorage.signOut();
    this.router.navigate(['/']);
    console.log(this.tokenStorage.getUsername());
  }

  onClick() {
    this.router.navigate(['/user/' + this.tokenStorage.getId() + '/board']);
  }

  // onSearchByTitleOrDescription() {
  //   const searchFrom: SearchCardForm = {
  //     title: this.searchForm,
  //     description: this.searchForm,
  //   };
  //
  //   console.log(searchFrom);
  //
  //   this.cardService.getSearchByTitleOrDescription(searchFrom).subscribe(
  //     next => {
  //       this.cardList = next;
  //     }, error => {
  //       console.log(error);
  //     }
  //   );
  // }

  onSearchComplete() {
    console.log('From Sarah with love: ', this.searchForm);
    this.searchCardService.send(this.searchForm);
  }
}
