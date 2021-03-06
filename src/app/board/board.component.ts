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
import {TokenStorageService} from '../auth/token-storage.service';
import {CommentService} from '../comment/service/comment.service';
import {IComment} from '../comment/icomment';
import {FileService} from '../upload-task/service/file.service';
import {IFile} from '../upload-task/IFile';
import {OrderChangeService} from '../otherService/orderChange/order-change.service';
import {NotificationService} from '../otherService/notification/notification.service';
import {ColorService} from '../otherService/color/color.service';
import {IColor} from '../otherInterface/iColor';


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

  notificationForm: FormGroup;

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
    private fileService: FileService,
    private orderChangeService: OrderChangeService,
    private notificationService: NotificationService,
    private colorService: ColorService,
  ) {
  }

  ngOnInit() {
    this.getAllUser();

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
      orderNumber: [''],
      listSet: [''],
      colors: [''],
    });

    this.listForm = this.fb.group({
      listName: ['new card', [Validators.required, Validators.minLength(10)]],
      boardSet: [this.boardSet, [Validators.required, Validators.minLength(10)]],
    });

    this.notificationForm = this.fb.group({
      id: [''],
      type: [''],
      cardNoti: [''],
      userCardNoti: [''],
    });

    const id = +this.route.snapshot.paramMap.get('id');
    this.boardId = id;
    this.displayUser(this.boardId);

    this.getList(id);

    this.getBoardByID(id);

  }

  // ------------------get user ----------------------------------
  getAllUser() {
    this.userService.getUser(10).subscribe(
      next => {
        this.listUser = next;
        console.log('success fetch the board');
      }, error => {
        console.log('fail to get all user');
      });
  }

  // ---------------------display user -----------------------------------
  displayUser(id: number) {
    this.boardService.getBoardById(id).subscribe(next => {
      this.board = next;
      this.users = this.board.userSet;
      this.newUser = this.board.userSet;
      this.boards.push(next);
      console.log('success to get board');
    }, error => {
      console.log('fail to get board');
    });
  }

  // ------------------------board-----------------------------------------
  getBoardByID(id: number) {
    this.boardService.getBoardById(id).subscribe(next => {
      this.boardSet = next;
      console.log('success fetch the board');
    }, error => {
      console.log('fail to fetch board');
    });
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

// -----------------------------List----------------------------------------
  getList(id: number) {
    this.listCardService.getListCardByBoard(10, id).subscribe(
      next => {
        this.listCards = next;
        console.log('list success');
      }, error => {
        console.log('error');
      }
    );
  }

  createList() {
    this.listForm = this.fb.group({
      listName: ['new list', [Validators.required, Validators.minLength(10)]],
      boardSet: [this.boardSet, [Validators.required, Validators.minLength(10)]],
    });
    const {value} = this.listForm;
    this.listCardService.createListCard(value)
      .subscribe(
        next => {
          this.getList(this.boardId);
          console.log('success to create a list card');
        }, error => {
          console.log('fail to create list card');
        });
  }

  deleteList(id: number) {
    this.listCardService.deleteListCard(id).subscribe(right => {
      console.log('success delete list card');
      this.getList(this.boardId);
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

  drop(event: CdkDragDrop<IListCard[]>) {
    moveItemInArray(this.listCards, event.previousIndex, event.currentIndex);
    this.changeListId(this.listCards);
  }

  updateList(list: IListCard) {
    this.listCardService.updateListCard(list).subscribe(next => {
      console.log('success to update list after drop');
      console.log(next);
    }, error => {
      console.log('fail to update after drop list');
    });
  }

  // ----------------------- add user to board ----------------------------

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

  addMember(users: IUser[]) {
    console.log(users);
    this.members = users;
    if (this.members !== []) {
      this.currentCard.userSetCard = this.members;
    }
  }


//  --------------------------- Card --------------------------------

  openCard(card: ICard) {
    this.currentCard = card;
    this.cardForm = this.fb.group({
      cardId: [this.currentCard.cardId],
      title: [this.currentCard.title, [Validators.required, Validators.minLength(10)]],
      description: [this.currentCard.description, [Validators.required, Validators.minLength(10)]],
      listSet: [this.currentCard.listSet],
      orderNumber: [this.currentCard.orderNumber],
      colors: [this.currentCard.colors],
    });
    this.cardForm.patchValue(this.currentCard);
    this.commentDisplay(this.currentCard);
    this.displayFile(this.currentCard);
  }

  // ---------------------------display comment-----------------------------
  commentDisplay(card: ICard) {
    this.commentService.getListCommentByCard(1000, this.currentCard.cardId).subscribe(next => {
      this.commentCard = next;
      console.log('success get comment');
    }, error => {
      console.log('cannot get comment');
    });
  }


  // -----------------------change listId of card----------------------------
  changeListId(lists: IListCard[]) {
    this.orderChangeService.changeCardOrder(lists);
    for (const list of lists) {
      this.updateList(list);
    }
  }

  // -------------save card form----------------
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
      this.getList(this.boardId);
    }, error => {
      console.log('error update');
    });
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
        this.commentDisplay(this.currentCard);
      }, error => {
        console.log('fail to create comment');
      });
      console.log('get user success');
    }, error => {
      console.log('cannot get user');
    });

    this.sendNotification();
  }

  sendNotification() {
    this.userService.getListUserByCard(1000, this.currentCard.cardId).subscribe(next => {
      this.userCard = next;
      for (const user of this.userCard) {
        if (user.email !== this.tokenStorage.getEmail()) {
          const {value} = this.notificationForm;
          value.type = 'comment';
          value.cardNoti = this.currentCard;
          value.userCardNoti = user;
          this.notificationService.createNotification(value).subscribe(success => {
            console.log('success create comment');
          }, error => {
            console.log('fail to create comment');
          });
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

  // ---------------------------------display file ---------------------------
  displayFile(card: ICard) {
    this.fileService.getFileByCard(1000, card.cardId).subscribe(next => {
      this.files = next;
      console.log(next);
      console.log('success to get file');
    }, error => {
      console.log('fail to get file');
    });
  }

  // ---------------------refresh page---------------------------
  refreshPage() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function () {
        this.router.navigate(['/board/' + this.boardSet.boardId + '/list']).then(r => console.log('success navigate'));
      }.bind(this), 500);
    });
  }

  // ----------------display file after add----------------------
  fileDisplayAttach(display: boolean) {
    this.displayFile(this.currentCard);
  }

}
