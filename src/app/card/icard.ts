import {IUser} from '../user/iuser';

export interface ICard {
  cardId: number;
  title: string;
  description: string;
  listSet: {
    listId: number;
  };
  userSetCard: IUser[];
  colors: string[];
}
