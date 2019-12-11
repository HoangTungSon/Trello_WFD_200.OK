import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ListCardService} from './service/list-card.service';
import {IListCard} from './ilist-card';
import {CdkDragDrop, CdkDragEnd, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {CardService} from '../card/service/card.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ICard} from '../card/icard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BoardService} from '../board/service/board.service';
import {IUser} from '../user/iuser';
import {UserService} from '../user/service/user.service';
import {SearchCardService} from '../card/service/search-card.service';
import {TokenStorageService} from '../auth/token-storage.service';
import {INotification} from '../otherInterface/iNotification';
import {OrderChangeService} from '../otherService/orderChange/order-change.service';
import {NotificationService} from '../otherService/notification/notification.service';
import {ColorService} from '../otherService/color/color.service';
import {IColor} from '../otherInterface/iColor';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.css']
})
export class ListCardComponent implements OnInit {

  @Input() users: IUser[];
  @Input() id: number;
  @Output() selectCard = new EventEmitter<ICard>();
  @Output() arrays = new EventEmitter<number>();
  @Input() listIdArrays: number[];

  card: ICard;

  listSet: IListCard;

  cardForm: FormGroup;

  searchDisplay: ICard[] = [];

  searchCard: ICard[];

  cardSearch: ICard[] = [];

  userList: IUser[] = [];

  userCard: IUser[] = [];

  labels: IColor[] = [];

  notificationForm: FormGroup;

  notification: INotification;

  constructor(
    private boardService: BoardService,
    private listService: ListCardService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private searchCardService: SearchCardService,
    private tokenStorage: TokenStorageService,
    private orderChangeService: OrderChangeService,
    private notificationService: NotificationService,
    private colorService: ColorService,
  ) {
  }

  ngOnInit() {
    this.notificationForm = this.fb.group({
      id: [''],
      type: [''],
      cardNoti: [''],
      userCardNoti: [''],
    });
    // ---------------------find card by searchText ----------------------------
    this.searchCardService.listen().subscribe(searchText => {
      this.cardSearch = [];
      this.cardService.getSearchByTitleOrDescription(searchText, this.id).subscribe(next => {
        this.searchDisplay = next;
      }, error => {
        console.log('cannot find');
      });
    });

    this.getListCard(this.id);

    // ---------------------------find card by color ----------------------------------
    this.searchCardService.listenLabel().subscribe(searchLabel => {
      console.log(searchLabel);
      for (const label of searchLabel) {
        this.cardService.searchCardByColor(label, this.id).subscribe(success => {
          this.searchDisplay = success;
        }, error => {
          console.log('fail to get card by color');
        });
      }
    }, error => {
      console.log('fail to get search label');
    });

    // ------------------ find card by user -------------------------------
    this.searchCardService.listenUser().subscribe(searchUser => {
      console.log(searchUser);
      console.log('success listen');
      for (const user of searchUser) {
        this.cardService.searchCardByUser(user, this.id).subscribe(success => {
          this.searchDisplay = [];
          this.searchDisplay = success;
        }, error => {
          console.log('fail to get card by user');
        });
      }
    }, error => {
      console.log('cannot listen');
    });

    this.listService.getListCardById(this.id).subscribe(next => {
      this.listSet = next;
      console.log('success fetch the list');
    });
  }

  // --------------------------find card by list -----------------------------------
  getListCard(id: number) {
    this.cardService.getCardByList(10, id).subscribe(
      next => {
        this.searchDisplay = next;
        console.log('card success');
      }, error => {
        console.log(error);
        console.log('error');
        this.pushListId(this.id);
      }
    );
  }

  pushListId(id: number) {
    this.arrays.emit(id);
  }

  // -------------------change card detail when moving----------------------------------
  drop(event: CdkDragDrop<ICard[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateAllCardList(event.container.data);
      console.log('stay the same');
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      console.log('change container');
    }
  }

  // -------------------------------- noti after drag card -----------------------------------
  sendNotification(eventSend: CdkDragEnd<ICard>, card: ICard) {
    console.log(eventSend.source.dropContainer.data);
    this.userService.getListUserByCard(1000, card.cardId).subscribe(next => {
      this.userCard = next;
      console.log('success to get user of dragged card');
      for (const user of this.userCard) {
        if (user.email !== this.tokenStorage.getEmail()) {
          const {value} = this.notificationForm;
          value.type = 'card moving';
          value.userCardNoti = user;
          value.cardNoti = card;
          this.notificationService.createNotification(value).subscribe(success => {
            console.log('success create notification for user');
          }, error => {
            console.log('fail to create notification');
          });
        }
        this.userService.updateUser(user).subscribe(success => {
          console.log('success to update user noti after drag');
        }, error => {
          console.log('fail to update user noti after drag');
        });
      }
    }, error => {
      console.log('fail to get user after drag');
    });
    console.log(eventSend.source.data);
  }

  changeCardListSet(event: CdkDragDrop<ICard[]>, id: number) {
    console.log(event.container.id);
    if (event.previousContainer !== event.container) {
      this.cardService.getCardById(id).subscribe(
        next => {
          this.updateAllCardList(event.container.data);
          this.card = next;
          for (const card of event.container.data) {
            if (card.title === this.card.title) {
              this.card.orderNumber = card.orderNumber;
            }
          }
          this.card.listSet.listId = +event.container.id;
          this.updateCard(this.card);
          console.log('success drop');
        }, error => {
          console.log('fail to get cardId');
        });
    }
  }

  updateListCard(id: number) {
    this.cardService.getCardByList(1000, id).subscribe(next => {
      console.log(next);
      console.log('update after drag');
    }, error => {
      console.log('fail after drag');
    });
  }

  createCard(id) {
    this.cardForm = this.fb.group({
      title: ['new card', [Validators.required, Validators.minLength(10)]],
      description: ['nothing', [Validators.required, Validators.minLength(10)]],
      listSet: [this.listSet, [Validators.required, Validators.minLength(10)]],
    });
    const {value} = this.cardForm;
    this.cardService.createCard(value).subscribe(
      next => {
        this.getListCard(this.id);
        this.updateNotiUser(next);
        console.log('success to create a card');
      }, error => {
        console.log('fail to create card');
      });
  }

  updateNotiUser(next) {
    this.userService.getListUserByBoard(1000, this.listSet.boardSet.boardId).subscribe(listUser => {
      this.userList = listUser;
      for (const user of this.userList) {
        if (user.email !== this.tokenStorage.getEmail()) {
          this.notification = this.notificationForm.value;
          this.notification.type = 'create new card';
          this.notification.cardNoti = next;
          this.notification.userCardNoti = user;
          this.notificationService.createNotification(this.notification).subscribe(success => {
            console.log('success create notification for user');
          }, error => {
            console.log('fail to create notification');
          });
        }
        this.userService.updateUser(user).subscribe(userNoti => {
          console.log('success update userNoti');
        }, error => {
          console.log('fail to update userNoti');
        });
      }
      console.log('cardNoti update');
    }, error => {
      console.log('cannot add cardNoti');
    });
  }

  updateAllCardList(cards: ICard[]) {
    this.orderChangeService.changeCardOrder(cards);
    for (const card of cards) {
      this.updateCard(card);
    }
  }

  setOpenCart(item: ICard) {
    this.selectCard.emit(item);
  }

  updateCard(card: ICard) {
    this.cardService.updateCard(card).subscribe(next => {
      console.log('success to update card after drop');
      console.log(next);
      this.getListCard(this.id);
    }, error => {
      console.log('fail to update after drop card');
    });
  }
}
