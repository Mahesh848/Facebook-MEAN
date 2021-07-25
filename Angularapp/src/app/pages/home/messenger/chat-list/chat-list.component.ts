import { Message } from './../../../../interfaces/message';
import { MessengerUser } from './../../../../interfaces/messenger-user';
import { SocketService } from './../../../../services/socket/socket.service';
import { DataShareService } from './../../../../services/data-share/data-share.service';
import { ChatService } from './../../../../services/chat/chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  friends: MessengerUser[] = [];
  userid = '';
  username = '';
  selectedUser = '';

  constructor(
    private chatService: ChatService,
    private dataShareService: DataShareService,
    private socketService: SocketService
  ) {
    this.userid = localStorage.getItem('userid');
  }

  ngOnInit() {
    this.chatService.getAllChatFriends(this.userid).subscribe(
      (response: MessengerUser[]) => {
        console.log(response);
        this.friends = response;
      },
      (error) => {
        throw error;
      }
    );
    this.socketService.chatListResponse().subscribe(
      (response: MessengerUser) => {
        const index = this.friends.findIndex(frnd => frnd._id === response._id);
        if (index >= 0) {
          this.friends[index].online = 'Y';
        } else {
          this.friends.push(response);
        }
      }
    );
    this.socketService.unfriendResponse().subscribe(
      (response: string) => {
        this.friends = this.friends.filter(frnd => frnd._id !== response);
      },
      (error) => {
        throw error;
      }
    );
    this.socketService.makeOffline().subscribe(
      (response: any) => {
        if (response.on) {
          const index = this.friends.findIndex(frnd => frnd._id === response.userid);
          if (index >= 0) {
            this.friends[index].online = 'Y';
          }
        } else {
          const index = this.friends.findIndex(frnd => frnd._id === response.userid);
          if (index >= 0) {
            this.friends[index].online = 'N';
            this.friends[index].lastseen = new Date();
          }
        }
      },
      (error) => {
        throw error;
      }
    );

    this.socketService.messageResponse().subscribe(
      (response: Message) => {
        const index = this.friends.findIndex(frnd => frnd._id === response.from);
        if (index >= 0) {
          this.friends[index].unreadMessages = this.friends[index].unreadMessages + 1;
        }
      },
      (error) => {
        throw error;
      }
    );

  }

  selectUser(user: MessengerUser) {
    this.selectedUser = user._id;
    const index = this.friends.findIndex(frnd => frnd._id === user._id);
    if (index >= 0) {
      this.friends[index].unreadMessages = 0;
    }
    this.dataShareService.changeSelectedUser(user);
  }

  isSelectedUser(userid): boolean {
    if (!this.selectedUser) {
      return false;
    }
    return this.selectedUser === userid ? true : false;
  }

}
