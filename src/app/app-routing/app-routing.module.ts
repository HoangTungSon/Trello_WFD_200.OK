import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListCardComponent} from '../list-card/list-card.component';
import {BoardComponent} from '../board/board.component';

const routes: Routes = [{
  path: 'board/:id/list',
  component: BoardComponent
}, {
  path: 'list/:id',
  component: ListCardComponent
}];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
