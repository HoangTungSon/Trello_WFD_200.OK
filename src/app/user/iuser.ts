import {ICard} from '../card/icard';

export interface IUser {
  userId: number;
  username: string;
  email: string;
  password: string;
  userNotification: number;
  cardNoti: number[];
}
