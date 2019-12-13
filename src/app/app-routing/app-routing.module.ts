import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListCardComponent} from '../list-card/list-card.component';
import {BoardComponent} from '../board/board.component';
import {LoginComponent} from '../login/login.component';
import {UserComponent} from '../user/user.component';
import {RegisterComponent} from '../register/register.component';
import {ProfileComponent} from '../profile/profile.component';
import {HomePageComponent} from '../home-page/home-page.component';
import {CanActivateTeam} from '../active/CanActivateTeam';
import {NotActivateTeam} from '../active/NotActivateTeam';

const routes: Routes = [{
  path: 'board/:id/list',
  component: BoardComponent,
  canActivate: [CanActivateTeam],
}, {
  path: 'login',
  component: LoginComponent,
  canActivate: [NotActivateTeam],
}, {
  path: 'list/:id',
  component: ListCardComponent,
  canActivate: [CanActivateTeam],
}, {
  path: 'user/:id/board',
  component: UserComponent,
  canActivate: [CanActivateTeam],
}, {
  path: 'register',
  component: RegisterComponent,
  canActivate: [NotActivateTeam],

}, {
  path: 'profile/:id',
  component: ProfileComponent,
  canActivate: [CanActivateTeam],
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
