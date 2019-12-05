import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderChangeService {

  constructor() { }

  changeCardOrder(arrays) {
    let mid = 0;
    if (arrays !== null) {
      for (let i = 0; i < arrays.length; i++) {
        for (let j = i + 1; j < arrays.length; j++) {
          if (arrays[i].orderNumber > arrays[j].orderNumber) {
            mid = arrays[i].orderNumber;
            arrays[i].orderNumber = arrays[j].orderNumber;
            arrays[j].orderNumber = mid;
            console.log('success change order');
            console.log(arrays[i]);
            console.log(arrays[j]);
          }
        }
      }
    }
  }
}
