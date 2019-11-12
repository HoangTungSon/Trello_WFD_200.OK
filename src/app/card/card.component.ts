import {Component, OnInit} from '@angular/core';
import {CardService} from './service/card.service';
import {ICard} from './icard';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {IListCard} from '../list-card/ilist-card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  constructor(private cardService: CardService) {
  }

  cards: ICard[] = [];

  ngOnInit() {
    this.cardService.getCard().subscribe(
      next => {
        this.cards = next;
        console.log('success');
      }, error => {
        console.log('error');
      }
    );
  }

  drop(event: CdkDragDrop<ICard[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
