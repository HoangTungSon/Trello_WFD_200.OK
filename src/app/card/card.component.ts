import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardService} from './service/card.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ICard} from './icard';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user/service/user.service';
import {BoardService} from '../board/service/board.service';
import {IUser} from '../user/iuser';
import {IBoard} from '../board/iboard';
import {TokenStorageService} from '../auth/token-storage.service';
import {NotificationService} from '../otherService/notification/notification.service';
import {IColor} from "../otherInterface/iColor";
import {ColorService} from "../otherService/color/color.service";

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

  displayfile: true;

  @Output() member = new EventEmitter<IUser[]>();

  @Input() card: ICard;

  @Output() display = new EventEmitter<boolean>();

  id: number;

  memberCheck = false;

  notificationForm: FormGroup;
  colors: string  [] = [];
  colorsPick: IColor[] = [];

  cardColor: IColor[] = [];

  color1 = '#2883e9';
  color2 = '#e920e9';
  color3 = '#fffe11';
  color4 = '#eC4040';
  color5 = '#2DD02D';

  colorForm: FormGroup = new FormGroup({
    input1: new FormControl(''),
    input2: new FormControl(''),
    input3: new FormControl(''),
    input4: new FormControl(''),
    input5: new FormControl(''),
  });

  constructor(
    private boardService: BoardService,
    private userService: UserService,
    private cardService: CardService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorage: TokenStorageService,
    private notificationService: NotificationService,
    private colorService: ColorService,
  ) {
  }

  ngOnInit() {
    this.getUser();

    this.findColorByCard();

    this.colorService.getColors(1000).subscribe(next => {
      this.colorsPick = next;
      console.log(this.colorsPick);
      console.log('success get colors');
    }, error => {
      console.log('fail to get colors');
    });

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
    }
  }

// ------------------------------save label-----------------------------
  checkColor(color: string) {
    if (this.card.colors === null) {
      this.colors.push(color);
      this.card.colors = this.colors;
    } else if (this.card.colors.indexOf(color) === -1) {
      this.card.colors.push(color);
    } else {
      alert('Màu đã tồn tại!');
    }
    this.checkLabel(color);
  }

  checkLabel(color: string) {
    for (const colorPick of this.colorsPick) {
      if (color === colorPick.colorType) {
        colorPick.cardColorSet.push(this.card);
        console.log(colorPick.cardColorSet);
      }
    }
  }

  saveColor(idCard: any) {
    this.colors = [];
    if (this.colorForm.value.input1) {
      this.checkColor(this.color1);
    }

    if (this.colorForm.value.input2) {
      this.checkColor(this.color2);
    }

    if (this.colorForm.value.input3) {
      this.checkColor(this.color3);
    }

    if (this.colorForm.value.input4) {
      this.checkColor(this.color4);
    }

    if (this.colorForm.value.input5) {
      this.checkColor(this.color5);
    }
    console.log(this.colors);

    this.cardService.updateColor(this.card).subscribe(
      result => {
        console.log(result);
      }, error => {
        console.log('loi');
      }
    );

    for (const color of this.colorsPick) {
      this.colorService.updateColor(color).subscribe(next => {
        console.log(color);
        console.log('success update color');
      }, error => {
        console.log('fail to update color');
      });
    }
  }

  // reset label's card
  reset(idCard: any) {
    this.card.colors = [];
  }

  findColorByCard() {
    if (this.card !== undefined) {
      this.colorService.getListColorByCard(1000, this.card.cardId).subscribe(next => {
        this.cardColor = next;
        console.log('success to get card');
      }, error => {
        console.log('fail to get card');
      });
    }
  }

  // ---------------- send file display -------------------------
  displayFile() {
    this.display.emit(this.displayfile);
    console.log('send code');
  }

}
