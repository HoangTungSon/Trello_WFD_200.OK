import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListCardComponent} from '../list-card/list-card.component';
import {BoardComponent} from '../board/board.component';
import {LoginComponent} from '../login/login.component';
import {UserComponent} from '../user/user.component';
import {RegisterComponent} from '../register/register.component';

const routes: Routes = [{
  path: 'board/:id/list',
  component: BoardComponent
}, {
  path: 'login',
  component: LoginComponent
}, {
  path: 'list/:id',
  component: ListCardComponent
}, {
    path: 'user',
    component: UserComponent
  }, {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
