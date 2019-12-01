import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardService} from './service/card.service';
import {FormBuilder} from '@angular/forms';
import {ICard} from './icard';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user/service/user.service';
import {BoardService} from '../board/service/board.service';
import {IUser} from '../user/iuser';
import {IBoard} from '../board/iboard';
import {TokenStorageService} from '../auth/token-storage.service';

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

  isHovering: boolean;

  files: File[] = [];

  @Output() member = new EventEmitter<IUser[]>();

  @Input() card: ICard;

  id: number;

  memberCheck = false;

  constructor(
    private boardService: BoardService,
    private userService: UserService,
    private cardService: CardService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorage: TokenStorageService,
  ) {
  }

  ngOnInit() {

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
        this.members[this.members.length - 1] = mid;
        this.members.pop();
        this.memberCheck = true;
        break;
      } else {
        this.memberCheck = false;
      }
    }
    if (!this.memberCheck) {
      if (user.cardNoti === null) {
        user.cardNoti = [];
      }
      if (user.email !== this.tokenStorage.getEmail()) {
        user.cardNoti.push(this.card.cardId);
      }
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
          if (mem.email === memUser.email && mem.email !== this.tokenStorage.getEmail()) {
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

  // ----------------------------drag and drop file------------------------

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }
}
