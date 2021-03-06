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
import {IColor} from "../otherInterface/iColor";
import {ColorService} from "../otherService/color/color.service";

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
  colors: IColor[] = [];
  users: IUser[] = [];
  userFind: IUser[] = [];
  colorList: IColor[] = [];

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
              private colorService: ColorService,
  ) {
  }

  ngOnInit() {
    const id = +this.tokenStorage.getId();
    this.userId = +this.tokenStorage.getId();
    this.clickNoti();

    this.colorService.getColors(1000).subscribe(next => {
      this.colorList = next;
      console.log('success get color');
    }, error => {
      console.log('fail to get color');
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
    if (this.boardId !== undefined) {
      this.getUsersByBoard();
    }
  }

  getUsersByBoard() {
    this.userService.getListUserByBoard(1000, this.boardId).subscribe(next => {
      this.users = next;
      console.log(this.users);
      console.log('success get user');
    }, error => {
      console.log('fail to get user');
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
    for (const noti of this.cardsNotification) {
      this.notificationService.deleteNotification(noti.id).subscribe(next => {
        console.log('success get delete all noti');
        this.clickNoti();
      }, error => {
        console.log('fail to delete all noti');
      });
    }
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

  // onSearchLabel() {
  //   this.colors = [];
  //   if (this.colorForm.value.input1) {
  //     this.colors.push(this.colorList[0]);
  //   }
  //
  //   if (this.colorForm.value.input2) {
  //     this.colors.push(this.colorList[1]);
  //   }
  //
  //   if (this.colorForm.value.input3) {
  //     this.colors.push(this.colorList[2]);
  //   }
  //
  //   if (this.colorForm.value.input4) {
  //     this.colors.push(this.colorList[3]);
  //   }
  //
  //   if (this.colorForm.value.input5) {
  //     this.colors.push(this.colorList[4]);
  //   }
  //
  //   console.log(this.colors);
  //
  //   this.searchCardService.sendLabel(this.colors);
  // }

  onSearchLabel(color) {
    this.colors = [];
    if (this.color1 === color) {
      this.colors.push(this.colorList[0]);
    }

    if (this.color2 === color) {
      this.colors.push(this.colorList[1]);
    }

    if (this.color3 === color) {
      this.colors.push(this.colorList[2]);
    }

    if (this.color4 === color) {
      this.colors.push(this.colorList[3]);
    }

    if (this.color5 === color) {
      this.colors.push(this.colorList[4]);
    }

    console.log(this.colors);

    this.searchCardService.sendLabel(this.colors);
  }

  searchUserByName(name: string) {
    this.userService.getUserByNameAndBoard(1000, name, this.boardId).subscribe(next => {
      console.log(next);
      this.userFind = next;
      console.log('get user by name');
      console.log(this.userFind);
      this.searchCardService.sendUser(this.userFind);
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
    console.log(this.userId);
    this.notificationService.getListNotificationByUser(1000, this.userId).subscribe(next => {
      this.cardsNotification = next;
      console.log('success get noti by user');
    }, error => {
      this.cardsNotification = [];
      console.log('fail to get noti by user');
    });
  }

  resetSearch() {
    this.colors = [];
    this.searchCardService.sendLabel(this.colors);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function() {
        this.router.navigate(['/board/' + this.boardId + '/list']).then(r => console.log('success navigate'));
      }.bind(this), 100);
    });
  }
}
