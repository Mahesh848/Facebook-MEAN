import { DataShareService } from './data-share/data-share.service';
import { ChatService } from './chat/chat.service';
import { FormService } from './form/form.service';
import { AuthService } from './auth/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from './post/post.service';
import { SocketService } from './socket/socket.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AuthService,
    FormService,
    PostService,
    SocketService,
    ChatService,
    DataShareService
  ]
})
export class ServicesModule { }
