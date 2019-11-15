import { Component, OnInit } from '@angular/core';
import {UserService} from './service/user.service';
import {BoardService} from '../board/service/board.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IBoard} from '../board/iboard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IUser} from './iuser';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  listBoard: IBoard[] = [];
  listBoardByTime: IBoard[] = [];
  boardForm: FormGroup;
  userSet: IUser[] = [];

  constructor(
    private userservice: UserService,
    private boardservice: BoardService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.boardForm = this.fb.group({
      boardName: ['new board', [Validators.required, Validators.minLength(10)]],
      userSet: [this.userSet, [Validators.required, Validators.minLength(10)]]
    });

    this.boardservice.getListBoardByUser(10, id).subscribe(
      next => {
        this.listBoard = next;
        console.log('get board successfully');
      }, error => {
        console.log('get board error');
    }
    );

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
        this.userSet.push(next);
        console.log('success fetch the user');
      }
    );
  }

  createBoard() {
    this.boardForm = this.fb.group({
      boardName: ['new board', [Validators.required, Validators.minLength(10)]],
      userSet: [this.userSet, [Validators.required, Validators.minLength(10)]]
    });
    const {value} = this.boardForm;
    this.boardservice.createBoard(value)
      .subscribe(
        next => {
          console.log('success to create a board');
        }, error => {
          console.log('fail to create board');
        });
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function() {
        this.router.navigate(['/user/' + this.userSet.userId + '/board']).then(r => console.log('success navigate'));
      }.bind(this), 500);
    });
  }

  updateBoard(board, id) {
    this.boardservice.updateBoard(board, id).subscribe();
  }
}
