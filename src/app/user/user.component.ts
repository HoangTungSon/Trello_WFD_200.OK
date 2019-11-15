import { Component, OnInit } from '@angular/core';
import {UserService} from './service/user.service';
import {BoardService} from '../board/service/board.service';
import {ActivatedRoute} from '@angular/router';
import {IBoard} from '../board/iboard';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  listBoard: IBoard[] = [];
  listBoardByTime: IBoard[] = [];

  constructor(
    private userservice: UserService,
    private boardservice: BoardService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

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
  }
}
