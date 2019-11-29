import {Component, Input, OnInit} from '@angular/core';
import {TokenStorageService} from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {CardService} from '../card/service/card.service';
import {SearchCardService} from '../card/service/search-card.service';
import {IUser} from '../user/iuser';
import {UserService} from '../user/service/user.service';
import {ICard} from '../card/icard';
import {IBoard} from '../board/iboard';
import {BoardService} from '../board/service/board.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-login-taskbar',
  templateUrl: './login-taskbar.component.html',
  styleUrls: ['./login-taskbar.component.css']
})
export class LoginTaskbarComponent implements OnInit {
  searchText: string;
  user: IUser;
  cardsNotification: ICard[] = [];
  listBoard: IBoard[] = [];
  listBoardByTime: IBoard[] = [];
  inputBoard = new FormControl();
  iUsers: IUser[] = [];
  userId = this.tokenStorage.getId();

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private cardService: CardService,
              private searchCardService: SearchCardService,
              private userService: UserService,
              private boardService: BoardService
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

    this.boardService.getListBoardByUser(10, id).subscribe(
      next => {
        this.listBoard = next;
        console.log('get board successfully');
      }, error => {
        console.log('get board error');
      });

    this.boardService.getListBoardByTime(10, id).subscribe(
      next => {
        this.listBoardByTime = next;
        console.log('get board by time successfully');
      }, error1 => {
        console.log('get board by time error');
      }
    );

    this.userService.getUserById(id).subscribe(
      next => {
        this.iUsers.push(next);
        console.log('success fetch the user');
      }
    );
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

  updateBoard(board, id) {
    this.boardService.updateBoard(board, id).subscribe();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function() {
        this.router.navigate(['/board/' + id + '/list']).then(r => console.log('success navigate'));
      }.bind(this), 500);
    });
  }

  createBoard() {
    if (this.inputBoard.value == null) {
      return alert('Please enter board name');
    }

    const value: Partial<IBoard> = {
      boardName: this.inputBoard.value,
      userSet: this.iUsers
    };

    this.boardService.createBoard(value).subscribe(
      next => {
        console.log('success to create a board');
      }, error => {
        console.log('fail to create board');
      });

    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function() {
        this.router.navigate(['/user/' + this.userId + '/board']).then(r => console.log('success navigate'));
      }.bind(this), 500);
    });
  }


}
