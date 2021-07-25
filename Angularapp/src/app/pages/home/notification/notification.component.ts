import { Notification } from './../../../interfaces/notification';
import { SocketService } from './../../../services/socket/socket.service';
import { ChatService } from './../../../services/chat/chat.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications: Notification[] = [];

  userid = '';

  constructor(private chatService: ChatService, private socketService: SocketService, private router: Router) {
    this.userid = localStorage.getItem('userid');
  }

  ngOnInit() {
    this.chatService.getAllNotifications(this.userid).subscribe(
      (response: Notification[]) => {
        this.notifications = response;
      }
    );

    this.socketService.notification().subscribe(
      (response: Notification) => {
        this.notifications.unshift(response);
      }
    );
  }

  getPostDetails(postid) {
    this.router.navigate(['/pages/home/postdetails', postid]);
  }

}
