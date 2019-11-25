import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardService} from './service/card.service';
import {FormBuilder} from '@angular/forms';
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

  name: string;

  board: IBoard;

  users: IUser[];

  members: IUser[] = [];

  checkMembers: IUser[] = [];

  memberSameUserSet: IUser[] = [];

  @Output() member = new EventEmitter<IUser[]>();

  @Input() card: ICard;

  memberCheck = false;

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
    this.getUser();
  }

  getUser() {
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
    this.members = this.card.userSetCard;
    console.log('before pop' + this.members);
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].email === user.email) {
        const mid = this.members[i];
        this.members[i] = this.members[this.members.length - 1];
        this.members[this.members.length - 1] = this.members[i];
        this.members.pop();
        this.memberCheck = true;
        break;
      } else {
        this.memberCheck = false;
      }
    }
    if (!this.memberCheck) {
      user.userNotification++;
      this.userService.updateUser(user).subscribe(next => {
        console.log('noti up');
      }, error => {
        console.log('noti cannot update');
      });
      this.members.push(user);
    }
    this.member.emit(this.members);
    console.log('members after emit: ' + this.members);
  }

  searchUserByName(name) {
    this.getUser();
    this.memberSameUserSet = [];
    this.userService.getUserByName(100, name).subscribe(next => {
      this.checkMembers = next;
      console.log('function check user');
      for (const mem of this.checkMembers) {
        for (const memUser of this.users) {
          if (mem.email === memUser.email) {
            this.memberSameUserSet.push(mem);
            console.log(this.memberSameUserSet);
          }
        }
      }
      this.users = this.memberSameUserSet;
      console.log('success to get by name');
    }, error => {
      console.log('fail to get by name');
    });
  }

}
