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

  constructor(
    private listService: ListCardService,
    private cardService: CardService,
    private route: ActivatedRoute
  ) {
  }

  listCards: IListCard[] = [];

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

}
