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
import {FormControl, FormGroup} from '@angular/forms';
import {NotificationService} from '../otherService/notification/notification.service';
import {INotification} from '../otherInterface/iNotification';

@Component({
  selector: 'app-login-taskbar',
  templateUrl: './login-taskbar.component.html',
  styleUrls: ['./login-taskbar.component.css']
})
export class LoginTaskbarComponent implements OnInit {
  searchText: string;
  user: IUser;
  cardsNotification: INotification[] = [];
  listBoard: IBoard[] = [];
  listBoardByTime: IBoard[] = [];
  inputBoard = new FormControl();
  iUsers: IUser[] = [];
  userId: number;
  colors: string[] = [];
  users: IUser[] = [];
  userFind: IUser[] = [];

  @Input() boardId: number;

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
              private userService: UserService,
              private boardService: BoardService,
              private notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    const id = +this.tokenStorage.getId();
    this.clickNoti();

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
    if (this.boardId !== undefined) {
      this.userService.getListUserByBoard(1000, this.boardId).subscribe(next => {
        this.users = next;
        console.log(this.users);
        console.log('success get user');
      }, error => {
        console.log('fail to get user');
      });
    }
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
    for (const noti of this.cardsNotification) {
      this.notificationService.deleteNotification(noti.id).subscribe(next => {
        console.log('success get delete all noti');
      }, error => {
        console.log('fail to delete all noti');
      });
    }
  }

  updateBoard(board, id) {
    this.boardService.updateBoard(board, id).subscribe();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function () {
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
      setTimeout(function () {
        this.router.navigate(['/user/' + this.userId + '/board']).then(r => console.log('success navigate'));
      }.bind(this), 500);
    });
  }

  onSearchLabel() {
    this.colors = [];
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

  searchUserByName(name: string) {
    this.userService.getUserByName(1000, name).subscribe(next => {
      for (const user of next) {
        for (const user2 of this.users) {
          if (user.email === user2.email) {
            this.userFind.push(user);
          }
        }
      }
      this.users = this.userFind;
      console.log('get user by name');
      console.log(this.users);
      this.searchCardService.sendUser(this.users);
    }, error => {
      console.log('cannot get user by name');
    });
  }

  sendMember(user: IUser) {
    this.users = [];
    this.users.push(user);
    this.searchCardService.sendUser(this.users);
    this.userService.getListUserByBoard(1000, this.boardId).subscribe(next => {
      this.users = next;
      console.log(this.users);
      console.log('success get user');
    }, error => {
      console.log('fail to get user');
    });
  }

  clickNoti() {
    this.userId = +this.tokenStorage.getId();
    this.notificationService.getListNotificationByUser(1000, this.userId).subscribe(next => {
      this.cardsNotification = next;
      console.log('success get noti by user');
    }, error => {
      console.log('fail to get noti by user');
    });
  }
}
