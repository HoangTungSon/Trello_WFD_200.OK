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
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ColorPickerModule} from 'ngx-color-picker';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {A11yModule} from '@angular/cdk/a11y';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTreeModule} from '@angular/cdk/tree';
import {PortalModule} from '@angular/cdk/portal';
import {CommentComponent} from './comment/comment.component';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {UploadTaskComponent} from './upload-task/upload-task.component';
import {DropzoneDirective} from './dropzone.directive';
import {AngularFireDatabaseModule} from '@angular/fire/database';

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
    LoginTaskbarComponent,
    CommentComponent,
    UploadTaskComponent,
    DropzoneDirective,
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    ColorPickerModule,
    MatSidenavModule,
    MatButtonModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    PortalModule,
    ScrollingModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [Permissions, CanActivateTeam, NotActivateTeam],
  bootstrap: [AppComponent]
})
export class AppModule {}
