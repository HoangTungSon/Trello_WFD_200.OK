import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ListCardComponent} from './list-card/list-card.component';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {CardComponent} from './card/card.component';
import {BoardComponent} from './board/board.component';
import {UserComponent} from './user/user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ProfileComponent} from './profile/profile.component';
import {HomeTaskbarComponent} from './home-taskbar/home-taskbar.component';
import {HomePageComponent} from './home-page/home-page.component';
import {LoginTaskbarComponent} from './login-taskbar/login-taskbar.component';
import {NotActivateTeam} from './active/NotActivateTeam';
import {CanActivateTeam} from './active/CanActivateTeam';
import {Permissions} from './active/Permissions';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {ColorPickerModule} from 'ngx-color-picker';


@NgModule({
  declarations: [
    AppComponent,
    ListCardComponent,
    CardComponent,
    BoardComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeTaskbarComponent,
    HomePageComponent,
    LoginTaskbarComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    ColorPickerModule
  ],
  providers: [Permissions, CanActivateTeam, NotActivateTeam],
  bootstrap: [AppComponent]
})
export class AppModule {
}
