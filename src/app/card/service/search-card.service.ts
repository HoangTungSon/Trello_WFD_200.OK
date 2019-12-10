import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {IUser} from '../../user/iuser';
import {IColor} from "../../otherInterface/iColor";

@Injectable({
  providedIn: 'root'
})
export class SearchCardService {

  onSearchEnter = new Subject<string>();

  onSearchByLabel = new Subject<IColor[]>();

  onSearchByUser = new Subject<IUser[]>();

  constructor() {
  }

  send(text) {
    this.onSearchEnter.next(text);
  }

  listen() {
    return this.onSearchEnter.asObservable();
  }

  sendLabel(label: IColor[]) {
    this.onSearchByLabel.next(label);
    console.log(label);
  }

  listenLabel() {
    return this.onSearchByLabel.asObservable();
  }

  sendUser(users: IUser[]) {
    this.onSearchByUser.next(users);
    console.log(users);
  }

  listenUser() {
    return this.onSearchByUser.asObservable();
  }

}
