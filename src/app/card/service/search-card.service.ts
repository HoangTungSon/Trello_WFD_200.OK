import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchCardService {

  onSearchEnter = new Subject<string>();

  constructor() {
  }

  send(text) {
    this.onSearchEnter.next(text);
  }

  listen() {
    return this.onSearchEnter.asObservable();
  }

}
