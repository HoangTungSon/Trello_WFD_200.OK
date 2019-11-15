import {Component, Input, OnInit} from '@angular/core';
import {CardService} from './service/card.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ICard} from './icard';
import {Router} from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() id: number;

  constructor(
    private cardService: CardService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  card: ICard = {
    cardId: null,
    title: '',
    description: '',
    listSet: {
      listId: this.id
    }
  };

  cardForm: FormGroup;

  ngOnInit() {
    this.cardForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    this.cardService.createCard(this.card)
      .subscribe(
        next => {
          this.router.navigate(['/board/82/list']);
          console.log('success to create a card');
        }, error => {
          console.log('fail to create card');
        });
  }
}
