import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-testfile',
  templateUrl: './testfile.component.html',
  styleUrls: ['./testfile.component.css']
})
export class TestfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  w3_open() {
    document.getElementById('mySidebar').style.display = 'block';
  }

  w3_close() {
    document.getElementById('mySidebar').style.display = 'none';
  }

}
