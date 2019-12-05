import {IUser} from '../user/iuser';
import {ICard} from '../card/icard';

export interface INotification {
  id: number;
  type: string;
  userCardNoti: IUser;
  cardNoti: ICard;
}
