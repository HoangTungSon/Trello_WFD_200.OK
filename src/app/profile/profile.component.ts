import { Component, OnInit } from '@angular/core';
import {UserService} from '../user/service/user.service';
import {ActivatedRoute} from '@angular/router';
import {IUser} from '../user/iuser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: IUser;

  constructor(
    private userservice: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userservice.getUserById(id).subscribe(
      next => {
        this.user = next;
        console.log('get user successfully');
      }, error => {
        console.log('get user error');
      }
    );
  }

}
