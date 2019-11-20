import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from '../auth/token-storage.service';

@Component({
  selector: 'app-home-taskbar',
  templateUrl: './home-taskbar.component.html',
  styleUrls: ['./home-taskbar.component.css']
})
export class HomeTaskbarComponent implements OnInit {

  userId = this.tokenStorage.getId();

  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit() {
  }

}
