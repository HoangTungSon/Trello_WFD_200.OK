import {IUser} from '../user/iuser';

export interface IBoard {
  boardId: number;
  boardName: string;
  time: string;
  userSet: {
    userId: number;
  };
}
