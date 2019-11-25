import {Component, Input, OnInit} from '@angular/core';
import {BoardService} from './service/board.service';
import {ListCardService} from '../list-card/service/list-card.service';
import {CardService} from '../card/service/card.service';
import {IListCard} from '../list-card/ilist-card';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IBoard} from './iboard';
import {ICard} from '../card/icard';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {IUser} from '../user/iuser';
import {UserService} from '../user/service/user.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  board: IBoard;

  listCards: IListCard[] = [];

  listForm: FormGroup;

  boardSet: IBoard;

  cards: ICard[] = [];

  currentCard: ICard;

  cardForm: FormGroup;

  users: IUser[] = [];

  members: IUser[] = [];

  boardForm: FormGroup;

  boards: IBoard[] = [];

  listUser: IUser[] = [];

  newUser: IUser[] = [];

  constructor(
    private userService: UserService,
    private boardService: BoardService,
    private listCardService: ListCardService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit() {
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
    this.boardService.getBoardById(id).subscribe(next => {
      this.board = next;
      this.users = this.board.userSet;
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
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function() {
        this.router.navigate(['/board/' + this.boardSet.boardId + '/list']).then(r => console.log('success navigate'));
      }.bind(this), 500);
    });
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
  }

  changeNameList(id: number) {
    const {value} = this.listForm;
    value.id = id;
    this.listCardService.updateListCard(value, id).subscribe(next => {
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
          mid = lists[i].listId;
          lists[i].listId = lists[j].listId;
          lists[j].listId = mid;
        }
      }
    }
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
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          setTimeout(function() {
            this.router.navigate(['/board/' + this.boardSet.boardId + '/list']).then(r => console.log('success navigate'));
          }.bind(this), 500);
        });
      }, error => {
        console.log('add user fail');
    }
    );
  }

  addNewUser(users: IUser) {
    console.log(users);
    this.newUser.push(users);
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

  }

  submit() {
    const {value} = this.cardForm;
    this.cardService.updateCard(value).subscribe(next => {
      console.log(next);
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        setTimeout(function() {
          this.router.navigate(['/board/' + this.boardSet.boardId + '/list']).then(r => console.log('success navigate'));
        }.bind(this), 500);
      });
    }, error => {
      console.log('error update');
    });
  }

  addMember(users: IUser[]) {
    console.log(users);
    this.members = users;
  }
}
