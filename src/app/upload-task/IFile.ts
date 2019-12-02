import {ICard} from '../card/icard';

export interface IFile {
  id: number;
  url: string;
  card: ICard;
  type: string;
  fileName: string;
}
