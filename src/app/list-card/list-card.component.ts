import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ListCardService} from './service/list-card.service';
import {IListCard} from './ilist-card';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {CardService} from '../card/service/card.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ICard} from '../card/icard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BoardService} from '../board/service/board.service';
import {IUser} from '../user/iuser';
import {UserService} from '../user/service/user.service';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.css']
})
export class ListCardComponent implements OnInit {

  @Input() users: IUser[];
  @Input() id: number;
  @Output() selectCard = new EventEmitter<ICard>();

  cards: ICard[] = [];

  listId: number;

  card: ICard;

  listSet: IListCard;

  cardForm: FormGroup;

  constructor(
    private boardService: BoardService,
    private listService: ListCardService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.cardService.getCardByList(10, this.id).subscribe(
      next => {
        this.cards = next;
        console.log('card success');
      }, error => {
        console.log('error');
      }
    );
    this.listService.getListCardById(this.id).subscribe(next => {
      this.listSet = next;
      console.log('success fetch the list');
    });
  }

  drop(event: CdkDragDrop<ICard[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      if (event.currentIndex !== event.previousIndex) {
        this.changeCardId(event.container.data);
      }
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log('change container');
    }
  }

  change(event: CdkDragDrop<ICard[]>, id: number) {
    this.changeCardId(event.container.data);
    if (event.previousContainer !== event.container) {
      this.cardService.getCardById(id).subscribe(
        next => {
          this.card = next;
          this.getListId(event.container.data, this.card);
          this.cardService.updateCard(this.card).subscribe(success => {
            console.log('success update');
          });
          console.log('success drop');
        }
      );
    }
  }

  getListId(list: ICard[], card: ICard) {
    console.log(list);
    for (const li of list) {
      if (card.listSet.listId !== li.listSet.listId) {
        this.listId = li.listSet.listId;
      }
    }
    card.listSet.listId = this.listId;
  }

  createCard(id) {
    this.cardForm = this.fb.group({
      title: ['new card', [Validators.required, Validators.minLength(10)]],
      description: ['nothing', [Validators.required, Validators.minLength(10)]],
      listSet: [this.listSet, [Validators.required, Validators.minLength(10)]],
    });
    const {value} = this.cardForm;
    this.cardService.createCard(value)
      .subscribe(
        next => {
          console.log('success to create a card');
        }, error => {
          console.log('fail to create card');
        });
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      setTimeout(function() {
        this.router.navigate(['/board/' + id + '/list']).then(r => console.log('success navigate'));
      }.bind(this), 500);
    });
  }

  changeCardId(cards: ICard[]) {
    let mid = 0;
    if (cards !== null) {
      for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
          if (cards[i].cardId > cards[j].cardId) {
            mid = cards[i].cardId;
            cards[i].cardId = cards[j].cardId;
            cards[j].cardId = mid;
          }
        }
      }
    }
    for (const card of cards) {
      this.cardService.updateCard(card).subscribe(next => {
        console.log('success to update card after drop');
        console.log(next);
      }, error => {
        console.log('fail to update after drop card');
      });
    }
  }

  setOpenCart(item: ICard) {
    this.selectCard.emit(item);
  }
}
