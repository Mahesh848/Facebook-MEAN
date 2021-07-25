import { MessengerUser } from './../../../../interfaces/messenger-user';
import { ChatService } from './../../../../services/chat/chat.service';
import { Message } from './../../../../interfaces/message';
import { FormService } from './../../../../services/form/form.service';
import { FormGroup } from '@angular/forms';
import { DataShareService } from './../../../../services/data-share/data-share.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket/socket.service';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  public selectedUser: MessengerUser = null;
  userid = '';

  public messageForm: FormGroup = null;

  conversation: Message[] = [];

  public date: Date;

  @ViewChild('messageWrapper') private messageContainer: ElementRef;

  constructor(
      private datashareService: DataShareService,
      private formService: FormService,
      private router: Router,
      private chatService: ChatService,
      private socketService: SocketService
    ) {
      this.userid = localStorage.getItem('userid');
      this.messageForm = this.formService.createMessageForm();
   }

  ngOnInit() {
    this.datashareService.selectedUser.subscribe(
      (response: MessengerUser) => {
        if (response !== null) {
          this.selectedUser = response;
          this.getConversation(response._id);
          this.makeSeen();
        }
      }
    );

    setInterval(() => {
      this.date = new Date();
    }, 1000);

    this.socketService.messageResponse().subscribe(
      (response: Message) => {
        if (this.selectedUser._id === response.from) {
          this.conversation = [...this.conversation, response];
          this.scrollMessageContainer();
        }
      }
    );

    this.socketService.makeseenResponse().subscribe(
      (response: string) => {
        const len = this.conversation.length;
        for (let i = len - 1; i >= 0; i++) {
          if (!this.conversation[i].read) {
            this.conversation[i].read = true;
          } else {
            break;
          }
        }
      }
    );
  }

  getConversation(to) {
    this.chatService.getConversation(this.userid, to).subscribe(
      (response: Message[]) => {
        this.conversation = response;
        this.scrollMessageContainer();
      },
      (error) => {
        throw error;
      }
    );
  }

  sendMessage(event) {
    if (event.keyCode === 13) {
      const message = this.messageForm.controls['message'].value.trim();
      if (message === '' || message === undefined || message === null) {
        alert(`Message can't be empty.`);
      } else if (this.userid === '') {
        this.router.navigate(['/']);
      } else if (this.selectedUser._id === '') {
        alert(`Select a user to chat.`);
      } else {
        this.sendAndUpdateMessages({
          from: this.userid,
          message: (message).trim(),
          to: this.selectedUser._id,
          read: false,
          delete: 0
        });
      }
    }
  }

  sendAndUpdateMessages(message: Message) {
    try {
      this.messageForm.disable();
      this.socketService.messageRequest(message);
      this.conversation = [...this.conversation, message];
      this.messageForm.reset();
      this.messageForm.enable();
      this.scrollMessageContainer();
    } catch (error) {
      console.warn(error);
      alert(`Can't send your message`);
    }
  }

  scrollMessageContainer(): void {
    if (this.messageContainer !== undefined) {
      try {
        setTimeout(() => {
          this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight + 100;
        }, 100);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  alignMessageRight(userid) {
    if (userid === this.userid) {
      return true;
    }
    return false;
  }

  lastSeen() {
    if (this.selectedUser && this.selectedUser.lastseen !== undefined && this.selectedUser.online === 'N') {
      const date1 = new Date(this.selectedUser.lastseen).getTime();
      const date2 = this.date.getTime();
      const agotime_ms = date2 - date1;
      const agotime_s = Math.floor(agotime_ms / 1000);
      const agotime_m = Math.floor(agotime_s / 60);
      const agotime_h = Math.floor(agotime_m / 60);
      const agotime_d = Math.floor(agotime_h / 24);
      if (agotime_d > 0) {
        if (agotime_d === 1) {
          return agotime_d + ' d';
        }
        return agotime_d + ' ds';
      } else if (agotime_h > 0) {
          if (agotime_h === 1) {
            return agotime_h + ' hr';
          }
          return agotime_h + ' hrs';
      } else if (agotime_m > 0) {
        if (agotime_m === 1) {
          return agotime_m + ' min';
        }
        return agotime_m + ' mins';
      } else {
        return 'few secs';
      }
    } else {
      return '';
    }
  }
  makeSeen() {
    this.socketService.makeseenRequest(this.selectedUser._id, this.userid);
  }
}
