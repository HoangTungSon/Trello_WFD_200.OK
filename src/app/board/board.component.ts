import {Component, OnInit} from '@angular/core';
import {BoardService} from './service/board.service';
import {ListCardService} from '../list-card/service/list-card.service';
import {CardService} from '../card/service/card.service';
import {IListCard} from '../list-card/ilist-card';
import {ICard} from '../card/icard';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  listCards: IListCard[] = [];


  constructor(
    private boardService: BoardService,
    private listCardService: ListCardService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.listCardService.getListCardByBoard(10, id).subscribe(
      next => {
        this.listCards = next;
        console.log('list success');
      }, error => {
        console.log('error');
      }
    );
  }

}
