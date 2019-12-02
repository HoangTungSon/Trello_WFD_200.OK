import {ICard} from '../card/icard';
import {IUser} from '../user/iuser';

export interface IComment {
  id: number;
  commentLine: string;
  cardComment: ICard;
  userComment: IUser;
}
