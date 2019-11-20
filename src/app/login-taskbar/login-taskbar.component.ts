import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user/service/user.service';
import {IUser} from '../user/iuser';
import {CardService} from '../card/service/card.service';
import {ICard} from '../card/icard';
import {SearchByTitleOrDescription} from './Form/search-by-title-or-description';

@Component({
  selector: 'app-login-taskbar',
  templateUrl: './login-taskbar.component.html',
  styleUrls: ['./login-taskbar.component.css']
})
export class LoginTaskbarComponent implements OnInit {
  search: any;
  private cardList: ICard[];

  constructor(    private authService: AuthService,
                  private tokenStorage: TokenStorageService,
                  private router: Router,
                  private cardService: CardService
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
  }
}
