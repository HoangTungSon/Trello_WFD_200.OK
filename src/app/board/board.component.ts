import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChildren} from '@angular/core';
import {BoardService} from './service/board.service';
import {ListCardService} from '../list-card/service/list-card.service';
import {CardService} from '../card/service/card.service';
import {IListCard} from '../list-card/ilist-card';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IBoard} from './iboard';
import {ICard} from '../card/icard';
import {CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  listCards: IListCard[] = [];

  listForm: FormGroup;

  boardSet: IBoard;

  cards: ICard[] = [];

  constructor(
    private boardService: BoardService,
    private listCardService: ListCardService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
  ) {
  }

  @ViewChildren(CdkDropListGroup, null) group: CdkDropListGroup<CdkDropList>;

  ngOnInit() {
    this.listForm = this.fb.group({
      listName: ['new card', [Validators.required, Validators.minLength(10)]],
      boardSet: [this.boardSet, [Validators.required, Validators.minLength(10)]],
    });
    const id = +this.route.snapshot.paramMap.get('id');
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
  }

  createList() {
    this.listForm = this.fb.group({
      listName: ['new card', [Validators.required, Validators.minLength(10)]],
      boardSet: [this.boardSet, [Validators.required, Validators.minLength(10)]],
    });
    const {value} = this.listForm;
    this.listCardService.createListCard(value)
      .subscribe(
        next => {
          console.log('success to create a list');
        }, error => {
          console.log('fail to create card');
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listCards, event.previousIndex, event.currentIndex);
    this.changeListId(this.listCards);
  }
}
