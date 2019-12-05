import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardService} from './service/card.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ICard} from './icard';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user/service/user.service';
import {BoardService} from '../board/service/board.service';
import {IUser} from '../user/iuser';
import {IBoard} from '../board/iboard';
import {TokenStorageService} from '../auth/token-storage.service';
import {NotificationService} from '../otherService/notification/notification.service';

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

  notificationForm: FormGroup;

  constructor(
    private boardService: BoardService,
    private userService: UserService,
    private cardService: CardService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private notificationService: NotificationService,
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
    this.notificationForm = this.fb.group({
      id: [''],
      type: ['added you as member'],
      cardNoti: [this.card],
      userCardNoti: [''],
    });
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
      if (user.email !== this.tokenStorage.getEmail()) {
        const {value} = this.notificationForm;
        value.userCardNoti = user;
        this.notificationService.createNotification(value).subscribe(next => {
          console.log('success create notification for user');
        }, error => {
          console.log('fail to create notification');
        });
      }
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
      const file = files.item(i).name.split('.');
      console.log(file[1]);
    }
  }
}
