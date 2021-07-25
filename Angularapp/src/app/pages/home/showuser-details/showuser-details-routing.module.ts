import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowuserDetailsComponent } from './showuser-details.component';

const routes: Routes = [
  {
    path: ':id',
    component: ShowuserDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowuserDetailsRoutingModule { }
