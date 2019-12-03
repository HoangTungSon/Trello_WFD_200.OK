import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {BoardService} from './service/board.service';
import {ListCardService} from '../list-card/service/list-card.service';
import {CardService} from '../card/service/card.service';
import {IListCard} from '../list-card/ilist-card';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IBoard} from './iboard';
import {ICard} from '../card/icard';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {IUser} from '../user/iuser';
import {UserService} from '../user/service/user.service';
import {Cmyk, ColorPickerService} from 'ngx-color-picker';
import {any} from 'codelyzer/util/function';
import {TokenStorageService} from '../auth/token-storage.service';
import {CommentService} from '../comment/service/comment.service';
import {IComment} from '../comment/icomment';
import {FileService} from '../upload-task/service/file.service';
import {IFile} from '../upload-task/IFile';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  input1 = true;
  input2 = true;
  input3 = true;
  input4 = true;
  input5 = true;

  board: IBoard;

  listCards: IListCard[] = [];

  listForm: FormGroup;

  boardSet: IBoard;

  cards: ICard[] = [];

  currentCard: ICard;

  cardForm: FormGroup;

  users: IUser[] = [];

  members: IUser[] = [];

  checkBoard = false;

  user: IUser;
  boardForm: FormGroup;

  boards: IBoard[] = [];

  listUser: IUser[] = [];

  newUser: IUser[] = [];

  commentForm: FormGroup;

  userComment: IUser;

  commentCard: IComment[];

  userCard: IUser[] = [];

  boardId: number;

  files: IFile[] = [];

  constructor(
    private userService: UserService,
    private boardService: BoardService,
    private listCardService: ListCardService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private cpService: ColorPickerService,
    private tokenStorage: TokenStorageService,
    private commentService: CommentService,
    private fileService: FileService
  ) {
  }

  colors: string  [] = [];

  card: ICard;

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

  ngOnInit() {
    this.commentForm = this.fb.group({
      id: [''],
      commentLine: [''],
      cardComment: [this.currentCard],
      userComment: [this.userComment],
    });

    this.boardForm = this.fb.group({
      boardId: ['', [Validators.required, Validators.minLength(10)]],
      boardName: ['', [Validators.required, Validators.minLength(10)]],
      userSet: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.cardForm = this.fb.group({
      cardId: [''],
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      listSet: [''],
    });

    this.listForm = this.fb.group({
      listName: ['new card', [Validators.required, Validators.minLength(10)]],
      boardSet: [this.boardSet, [Validators.required, Validators.minLength(10)]],
    });

    const id = +this.route.snapshot.paramMap.get('id');
    this.boardId = id;
    this.boardService.getBoardById(id).subscribe(next => {
      this.board = next;
      this.users = this.board.userSet;
      this.newUser = this.board.userSet;
      this.boards.push(next);
      console.log('success to get board');
    }, error => {
      console.log('fail to get board');
    });

    this.listCardService.getListCardByBoard(10, id).subscribe(
      next => {
        this.listCards = next;
        console.log('list success');
      }, error => {
        console.log('error');
      }
    );

    this.boardService.getBoardById(id).subscribe(next => {
      this.boardSet = next;
      console.log('success fetch the board');
    });
    this.userService.getUser(10).subscribe(
      next => {
        this.listUser = next;
        console.log('success fetch the board');
      }
    );
  }

// -----------------------------List----------------------------------------

  createList() {
    this.listForm = this.fb.group({
      listName: ['new list', [Validators.required, Validators.minLength(10)]],
      boardSet: [this.boardSet, [Validators.required, Validators.minLength(10)]],
    });
    const {value} = this.listForm;
    this.listCardService.createListCard(value)
      .subscribe(
        next => {
          console.log('success to create a list card');
        }, error => {
          console.log('fail to create list card');
        });
    this.refreshPage();
  }

  deleteList(id: number) {
    this.listCardService.deleteListCard(id).subscribe(right => {
      console.log('success delete list card');
    }, wrong => {
      console.log('fail to delete list card');
    });
  }

  deleteListCard(id: number) {
    this.cardService.getCardByList(1000, id).subscribe(next => {
      this.cards = next;
      for (const card of this.cards) {
        this.cardService.deleteCard(card.cardId).subscribe(success => {
          console.log('success delete cards');
          this.deleteList(id);
        });
      }
    }, error => {
      this.deleteList(id);
      console.log('fail to delete cards from this list');
    });
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function() {
        this.router.navigate(['/board/' + this.boardSet.boardId + '/list']).then(r => console.log('success navigate'));
      }.bind(this), 3000);
    });
    this.refreshPage();
  }

  changeNameList(id: number) {
    const {value} = this.listForm;
    value.listId = id;
    this.listCardService.updateListCard(value).subscribe(next => {
      console.log('success update list');
    }, error => {
      console.log('fail to change');
    });
  }

  changeListId(lists: IListCard[]) {
    let mid = 0;
    for (let i = 0; i < lists.length; i++) {
      for (let j = i + 1; j < lists.length; j++) {
        if (lists[i].listId > lists[j].listId) {
          const id1 = lists[i].listId;
          const id2 = lists[j].listId;
          mid = lists[i].listId;
          lists[i].listId = lists[j].listId;
          lists[j].listId = mid;
          this.listCardService.updateCardListId(lists[i], id1, id2).subscribe(next => {
            console.log('success swap card');
          }, error => {
            console.log('fail to swap card');
          });
        }
      }
    }
    for (const list of lists) {
      this.listCardService.updateListCard(list).subscribe(next => {
        console.log('success to update list after drop');
        console.log(next);
      }, error => {
        console.log('fail to update after drop list');
      });
    }
  }

  updateCard(card) {
    this.cardService.updateCard(card).subscribe(next => {
      console.log('update card');
    }, error => {
      console.log('fail to update card');
    });
  }

  drop(event: CdkDragDrop<IListCard[]>) {
    moveItemInArray(this.listCards, event.previousIndex, event.currentIndex);
    this.changeListId(this.listCards);
  }


  changeNameBoard(id) {
    const {value} = this.boardForm;
    value.boardId = id;
    value.userSet = this.boardSet.userSet;
    console.log(value);
    this.boardService.updateBoard(value, id).subscribe(next => {
      console.log('success update board name');
    }, error => {
      console.log('fail to change board name');
    });
  }

  addUserToBoard() {
    const {value} = this.boardForm;
    value.boardId = this.board.boardId;
    value.boardName = this.board.boardName;
    value.userSet = this.newUser;
    console.log(value);
    this.boardService.updateBoard(value, this.board.boardId).subscribe(
      next => {
        console.log('add user success');
        this.refreshPage();
      }, error => {
        console.log('add user fail');
      }
    );
  }

  addNewUser(newUser: IUser) {
    this.newUser = this.board.userSet;
    for (let i = 0; i < this.newUser.length; i++) {
      if (newUser.email === this.newUser[i].email) {
        const mid = this.newUser[i];
        this.newUser[i] = this.newUser[this.newUser.length - 1];
        this.newUser[this.newUser.length - 1] = mid;
        this.newUser.pop();
        this.checkBoard = true;
        break;
      } else {
        this.checkBoard = false;
      }
    }
    if (!this.checkBoard) {
      if (this.newUser === null) {
        this.newUser = [];
      }
      this.newUser.push(newUser);
    }
    console.log(newUser);
  }

//  ---------------------------- Card --------------------------------

  openCard(card: ICard) {
    this.currentCard = card;
    this.cardForm = this.fb.group({
      cardId: [this.currentCard.cardId],
      title: [this.currentCard.title, [Validators.required, Validators.minLength(10)]],
      description: [this.currentCard.description, [Validators.required, Validators.minLength(10)]],
      listSet: [this.currentCard.listSet],
    });
    this.cardForm.patchValue(this.currentCard);
    this.commentService.getListCommentByCard(1000, this.currentCard.cardId).subscribe(next => {
      this.commentCard = next;
      console.log('success get comment');
    }, error => {
      console.log('cannot get comment');
    });
    this.displayFile(this.currentCard);
  }

  addMember(users: IUser[]) {
    console.log(users);
    this.members = users;
    if (this.members !== []) {
      this.currentCard.userSetCard = this.members;
    }
  }

  submit() {
    const {value} = this.cardForm;
    if (this.members.length > 0) {
      console.log(this.members);
      value.userSetCard = this.members;
    } else {
      console.log(this.currentCard.userSetCard);
      value.userSetCard = this.currentCard.userSetCard;
    }
    this.cardService.updateCard(value).subscribe(next => {
      console.log(next);
      this.refreshPage();
    }, error => {
      console.log('error update');
    });
  }

  userMember(user: IUser) {
    this.user = user;
    console.log(this.user);
  }

  // ----------------------comment-------------------------------

  createComment() {
    const idUser = +this.tokenStorage.getId();
    this.userService.getUserById(idUser).subscribe(next => {
      this.userComment = next;
      const {value} = this.commentForm;
      value.userComment = this.userComment;
      value.cardComment = this.currentCard;
      this.commentService.createComment(value).subscribe(success => {
        console.log(success);
        console.log('success create comment');
      }, error => {
        console.log('fail to create comment');
      });
      console.log('get user success');
    }, error => {
      console.log('cannot get user');
    });
    this.userService.getListUserByCard(1000, this.currentCard.cardId).subscribe(next => {
      this.userCard = next;
      for (const user of this.userCard) {
        if (user.email !== this.tokenStorage.getEmail()) {
          user.cardNoti.push(this.currentCard.cardId);
        }
        this.userService.updateUser(user).subscribe(userNoti => {
          console.log('success update userNoti');
        }, error => {
          console.log('fail to update userNoti');
        });
      }
    }, error => {
      console.log('fail to get user');
    });
  }

  displayFile(card: ICard) {
    this.fileService.getFileByCard(1000, card.cardId).subscribe(next => {
      this.files = next;
      console.log(next);
      console.log('success to get file');
    }, error => {
      console.log('fail to get file');
    });
  }

  // -------------------- label ----------------------

  check() {
    console.log(this.colorForm.value.input1);
    if (this.colorForm.value.input1) {
      this.colors.push(this.colorForm.value.input1);
    }
    console.log(this.colors);
  }

  checkColor(color) {
    if (this.currentCard.colors === null) {
      this.colors.push(color);
      this.currentCard.colors = this.colors;
    } else if (this.currentCard.colors.indexOf(color) === -1) {
      this.currentCard.colors.push(color);
    } else {
      alert('Màu đã tồn tại!');
    }
}
  // reset label's card
  reset(idCard: any) {
    this.currentCard.colors = [];
  }

  saveColor(idCard: any) {
    console.log(this.input1);
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
    this.cardService.updateColor(this.currentCard).subscribe(
      result => {
        console.log(result);
      }, error => {
        console.log('loi');
      }
    );
  }

  // ---------------------refresh page---------------------------
  refreshPage() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function() {
        this.router.navigate(['/board/' + this.boardSet.boardId + '/list']).then(r => console.log('success navigate'));
      }.bind(this), 500);
    });
  }

}
