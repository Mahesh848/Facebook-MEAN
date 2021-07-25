import { SocketService } from './../../../../services/socket/socket.service';
import { ChatService } from './../../../../services/chat/chat.service';
import { FriendRequest } from './../../../../interfaces/friend-request';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  friends: FriendRequest[] = [];
  userid = '';
  constructor(private chatService: ChatService, private socketService: SocketService) {
    this.userid = localStorage.getItem('userid');
  }

  ngOnInit() {
    $(document).ready(function() {
      $('.timeline').on('click', '#unfriend-btn', function() {
        $(this).siblings('.unfriend').fadeToggle('fast', 'linear', function() {

        });
        return false;
      });
      $(document).click(function() {
        $('.unfriend').hide();
      });
    });

    this.chatService.getAllFriends(this.userid).subscribe(
      (response: FriendRequest[]) => {
        this.friends = response;
      },
      (error) => {
        throw error;
      }
    );

    this.socketService.unfriendResponse().subscribe(
      (response: string) => {
        this.friends = this.friends.filter(frnd => frnd.id !== response);
      },
      (error) => {
        throw error;
      }
    );
  }

  unfriend(userid) {
    this.socketService.unfriendRequest(this.userid, userid);
  }

}
