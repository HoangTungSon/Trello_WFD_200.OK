import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-testfile',
  templateUrl: './testfile.component.html',
  styleUrls: ['./testfile.component.css']
})
export class TestfileComponent implements OnInit {

  color1 = '#2883e9';
  color2 = '#e920e9';
  color3 = '#e4E925';
  color4 = '#eC4040';
  color5 = '#2DD02D';

  colorForm: FormGroup = new FormGroup({
    input10: new FormControl(''),
    input20: new FormControl(''),
    input30: new FormControl(''),
    input40: new FormControl(''),
    input50: new FormControl(''),
  });

  constructor() { }

  ngOnInit() {
  }

}
