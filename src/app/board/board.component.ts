import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BoardService} from './service/board.service';
import {ListCardService} from '../list-card/service/list-card.service';
import {CardService} from '../card/service/card.service';
import {IListCard} from '../list-card/ilist-card';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IBoard} from './iboard';
import {ICard} from '../card/icard';

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
    const id = +this.route.snapshot.paramMap.get('id');
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
        this.router.navigate(['/board/' + id + '/list']).then(r => console.log('success navigate'));
      }.bind(this), 500);
    });
  }

  deleteListUrl(id: number) {
    this.listCardService.deleteListCard(id).subscribe(right => {
      console.log('success delete list card');
    }, wrong => {
      console.log('fail to delete list card');
    });
  }

  deleteList(id: number) {
    this.cardService.getCardByList(1000, id).subscribe(next => {
      this.cards = next;
      for (const card of this.cards) {
        this.cardService.deleteCard(card.cardId).subscribe(success => {
          console.log('success delete cards');
          this.deleteListUrl(id);
        });
      }
    }, error => {
      this.deleteListUrl(id);
      console.log('fail to delete cards from this list');
    });
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function() {
        this.router.navigate(['/board/' + id + '/list']).then(r => console.log('success navigate'));
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
}
