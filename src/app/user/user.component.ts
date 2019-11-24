import { Component, OnInit } from '@angular/core';
import {UserService} from './service/user.service';
import {BoardService} from '../board/service/board.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IBoard} from '../board/iboard';
import {FormBuilder, FormControl} from '@angular/forms';
import {IUser} from './iuser';
import {TokenStorageService} from '../auth/token-storage.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  listBoard: IBoard[] = [];
  listBoardByTime: IBoard[] = [];
  iUsers: IUser[] = [];
  inputBoard = new FormControl();
  userId = this.tokenStorage.getId();
  user: IUser;
  userNoti: number;

  constructor(
    private userservice: UserService,
    private boardservice: BoardService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.boardservice.getListBoardByUser(10, id).subscribe(
      next => {
        this.listBoard = next;
        console.log('get board successfully');
      }, error => {
        console.log('get board error');
    });

    this.userservice.getUserById(id).subscribe(next => {
      this.user = next;
      this.userNoti = this.user.userNotification;
      console.log(this.user);
    });

    this.boardservice.getListBoardByTime(10, id).subscribe(
      next => {
        this.listBoardByTime = next;
        console.log('get board by time successfully');
      }, error1 => {
        console.log('get board by time error');
      }
    );

    this.userservice.getUserById(id).subscribe(
      next => {
        this.iUsers.push(next);
        console.log('success fetch the user');
      }
    );
  }

  createBoard() {
    if (this.inputBoard.value == null) {
      return alert('Please enter board name');
    }

    const value: Partial<IBoard> = {
      boardName: this.inputBoard.value,
      userSet: this.iUsers
    };

    this.boardservice.createBoard(value).subscribe(
      next => {
        console.log('success to create a board');
      }, error => {
      console.log('fail to create board');
    });

    this.refreshPage();
  }

  updateBoard(board, id) {
    this.boardservice.updateBoard(board, id).subscribe();
  }

  deleteBoard(id) {
    this.boardservice.deleteBoard(id).subscribe();
    this.refreshPage();
  }

  refreshPage() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function() {
        this.router.navigate(['/user/' + this.userId + '/board']).then(r => console.log('success navigate'));
      }.bind(this), 500);
    });
  }
}
