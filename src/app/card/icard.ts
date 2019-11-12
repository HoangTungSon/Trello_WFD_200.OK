export interface ICard {
  cardId: number;
  title: string;
  description: string;
  listSet: {
    listId: number;
  };
}
