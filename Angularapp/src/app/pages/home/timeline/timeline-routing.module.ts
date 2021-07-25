import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimelineComponent } from './timeline.component';

const routes: Routes = [
  {
    path: '',
    component: TimelineComponent,
    children: [
      {
        path: '',
        redirectTo: 'activity',
        pathMatch: 'full'
      },
      {
        path: 'activity',
        loadChildren: './activity/activity.module#ActivityModule'
      },
      {
        path: 'friends',
        loadChildren: './friends/friends.module#FriendsModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineRoutingModule { }
