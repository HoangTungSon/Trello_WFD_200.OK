import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardService} from './service/card.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ICard} from './icard';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user/service/user.service';
import {BoardService} from '../board/service/board.service';
import {IUser} from '../user/iuser';
import {IBoard} from '../board/iboard';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  board: IBoard;

  users: IUser[];

  members: IUser[] = [];

  @Output() member = new EventEmitter<IUser[]>();

  constructor(
    private boardService: BoardService,
    private userService: UserService,
    private cardService: CardService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.boardService.getBoardById(id).subscribe(next => {
      this.board = next;
      console.log('success to get board');
      this.users = this.board.userSet;
    }, error => {
      console.log('fail to get board');
    });
  }

  sendMember(user: IUser) {
    this.members.push(user);
    this.member.emit(this.members);
    console.log('members after emit: ' + this.members);
  }
}
