import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TokenStorageService} from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user/service/user.service';
import {IUser} from '../user/iuser';
import {CardService} from '../card/service/card.service';
<<<<<<< HEAD
import {SearchCardForm} from './search-card-form';
import {ICard} from '../card/icard';
import {SearchCardService} from '../card/service/search-card.service';
=======
import {ICard} from '../card/icard';
import {SearchByTitleOrDescription} from './Form/search-by-title-or-description';
>>>>>>> 7e783906be7a929c5014c9c706d0529cdbf6c91b

@Component({
  selector: 'app-login-taskbar',
  templateUrl: './login-taskbar.component.html',
  styleUrls: ['./login-taskbar.component.css']
})
export class LoginTaskbarComponent implements OnInit {
  search: any;
  private cardList: ICard[];

  searchForm: any;
  private cardList: ICard[];

  constructor(    private authService: AuthService,
                  private tokenStorage: TokenStorageService,
                  private router: Router,
<<<<<<< HEAD
                  private cardService: CardService,
                  private searchCardService: SearchCardService
=======
                  private cardService: CardService
>>>>>>> 7e783906be7a929c5014c9c706d0529cdbf6c91b
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

<<<<<<< HEAD
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
=======
  onSearchByTitleOrDescription() {
    const searchForm: SearchByTitleOrDescription = {
      title: this.search,
      description: this.search
    };
    console.log(searchForm);
    this.cardService.getSearchAllByTitleOrDescription(searchForm).subscribe(
      next => {
        this.cardList = next;
      }, error => {
        console.log(error);
      }
    );
>>>>>>> 7e783906be7a929c5014c9c706d0529cdbf6c91b
  }
}
