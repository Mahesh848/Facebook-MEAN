import { ConversationModule } from './conversation/conversation.module';
import { ChatListModule } from './chat-list/chat-list.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessengerRoutingModule } from './messenger-routing.module';
import { MessengerComponent } from './messenger.component';

@NgModule({
  imports: [
    CommonModule,
    MessengerRoutingModule,
    ChatListModule,
    ConversationModule
  ],
  declarations: [MessengerComponent]
})
export class MessengerModule { }
