import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsComponent } from './posts/posts.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full'
      },
      {
        path: 'posts',
        loadChildren: './posts/posts.module#PostsModule'
      },
      {
        path: 'messenger',
        loadChildren: './messenger/messenger.module#MessengerModule'
      },
      {
        path: 'postdetails',
        loadChildren: './post-details/post-details.module#PostDetailsModule'
      },
      {
        path: 'showuserdetails',
        loadChildren: './showuser-details/showuser-details.module#ShowuserDetailsModule'
      },
      {
        path: 'timeline',
        loadChildren: './timeline/timeline.module#TimelineModule'
      },
      {
        path: 'friendrequest',
        loadChildren: './friend-request/friend-request.module#FriendRequestModule'
      },
      {
        path: 'search',
        loadChildren: './search/search.module#SearchModule'
      },
      {
        path: 'notifications',
        loadChildren: './notification/notification.module#NotificationModule'
      },
      {
        path: 'aboutus',
        loadChildren: './aboutus/aboutus.module#AboutusModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
