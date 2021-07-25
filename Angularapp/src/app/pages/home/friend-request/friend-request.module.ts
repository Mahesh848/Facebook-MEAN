import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendRequestRoutingModule } from './friend-request-routing.module';
import { FriendRequestComponent } from './friend-request.component';

@NgModule({
  imports: [
    CommonModule,
    FriendRequestRoutingModule
  ],
  declarations: [FriendRequestComponent]
})
export class FriendRequestModule { }
