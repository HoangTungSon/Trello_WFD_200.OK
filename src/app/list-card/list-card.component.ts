import {Component, Input, OnInit} from '@angular/core';
import {ListCardService} from './service/list-card.service';
import {IListCard} from './ilist-card';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {CardService} from '../card/service/card.service';
import {ActivatedRoute} from '@angular/router';
import {ICard} from '../card/icard';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.css']
})
export class ListCardComponent implements OnInit {

  @Input() id: number;

  cards: ICard[] = [];

  card: ICard;

  constructor(
    private listService: ListCardService,
    private cardService: CardService,
    private route: ActivatedRoute
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
  }

  drop(event: CdkDragDrop<ICard[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log('still at same container');
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log('change container');
    }
  }

  change(event: CdkDragDrop<ICard>, id: number) {
    if (event.previousContainer !== event.container) {
      this.cardService.getCardById(id).subscribe(
        next => {
          this.card = next;
          this.card.listSet.listId = event.container.data.listSet.listId;
          this.cardService.updateCard(this.card).subscribe(success => {
            console.log('success update');
          });
          console.log('success drop');
        }
      );
    }
  }
}
