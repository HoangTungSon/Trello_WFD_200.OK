import {ICard} from '../card/icard';

export interface IColor {
  colorId: number;
  colorType: string;
  cardColorSet: ICard[];
}
