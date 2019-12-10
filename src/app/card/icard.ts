import {IUser} from '../user/iuser';
import {IColor} from '../otherInterface/iColor';

export interface ICard {
  cardId: number;
  title: string;
  description: string;
  listSet: {
    listId: number;
  };
  userSetCard: IUser[];
  colors: string[];
  orderNumber: number;
}
