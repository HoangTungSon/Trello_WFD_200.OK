import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListCardComponent} from '../list-card/list-card.component';
import {BoardComponent} from '../board/board.component';
import {LoginComponent} from '../login/login.component';
import {UserComponent} from '../user/user.component';
import {RegisterComponent} from '../register/register.component';
import {ProfileComponent} from '../profile/profile.component';
import {HomePageComponent} from '../home-page/home-page.component';

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
  path: 'user/:id/time',
  component: UserComponent
}, {
  path: 'register',
  component: RegisterComponent
}, {
  path: 'profile',
  component: ProfileComponent
}, {
  path: '',
  component: HomePageComponent
}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
