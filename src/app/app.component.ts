import { Component } from '@angular/core';
import {environment} from '../environments/environment';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private authority: string;
  title = 'trello-frontend';
  public appFirebase = firebase.initializeApp(environment.firebaseConfig);
}
