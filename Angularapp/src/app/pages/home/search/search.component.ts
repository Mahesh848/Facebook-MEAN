import { FriendRequest } from './../../../interfaces/friend-request';
import { SocketService } from 'src/app/services/socket/socket.service';
import { AuthService } from './../../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from './../../../interfaces/user';
import { ChatService } from './../../../services/chat/chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  users: User[] = [];

  searchtext = '';

  user: User = null;
  userid = '';

  receivedRequests: FriendRequest[] = [];
  sentRequests: FriendRequest[] = [];

  friends: FriendRequest[] = [];

  constructor(private chatService: ChatService,
    private router: ActivatedRoute,
    private authService: AuthService,
    private socketService: SocketService,
  ) {
    this.router.params.subscribe(
      params => {
        this.searchtext = params['searchtext'];
        this.search(this.searchtext);
      }
    );
  }

  ngOnInit() {
    this.userid = localStorage.getItem('userid');
    this.authService.getUserDetails(this.userid).subscribe(
      (response: User) => {
        this.user = response;
      },
      (error) => {
        throw error;
      }
    );
    this.chatService.getAllFriendRequests(this.userid).subscribe(
      (response: any) => {
        if (!response.error) {
          this.receivedRequests = response.receivedRequests.receivedRequests;
          this.sentRequests = response.receivedRequests.sentRequests;
        } else {
          console.log('Error');
        }
      }
    );
    this.socketService.receivedFriendrequestResponse().subscribe(
      (response: FriendRequest) => {
          this.receivedRequests.push(response);
      },
      (error) => {
        throw error;
      }
    );
    this.chatService.getAllFriends(this.userid).subscribe(
      (response: FriendRequest[]) => {
        this.friends = response;
      },
      (error) => {
        throw error;
      }
    );
    this.socketService.sentFriendrequestResponse().subscribe(
      (response: FriendRequest) => {
          this.sentRequests.push(response);
      },
      (error) => {
        throw error;
      }
    );
    this.socketService.deleteSentFriendrequestResponse().subscribe(
      (response: string) => {
        this.sentRequests = this.sentRequests.filter(req => req.id !== response);
      },
      (error) => {
        throw error;
      }
    );
    this.socketService.deleteReceivedFriendrequestResponse().subscribe(
      (response: string) => {
        this.receivedRequests = this.receivedRequests.filter(req => req.id === response);
      },
      (error) => {
        throw error;
      }
    );
  }

  search(searchtext) {
    this.chatService.search(searchtext).subscribe(
      (response: any) => {
        if (response.error) {
          console.log('Error');
        } else {
          this.users = response.people;
        }
      }
    );
  }

  sendAfriendRequest(userid, username, profile, gender) {
    const sentFriendreq = {
      id: userid,
      name: username,
      profile: profile,
      gender: gender,
      read: false
    };
    const recievedFriendreq = {
      id: this.userid,
      name: this.user.firstname + ' ' + this.user.surname,
      profile: this.user.profile,
      gender: this.user.gender,
      read: false
    };
    this.socketService.friendrequestRequest(sentFriendreq, recievedFriendreq);
  }

  removeRequest(receiver) {
    this.socketService.deleteFriendrequest(this.userid, receiver);
  }

  checkForFriendRequests(userid) {
    // console.log(this.sentRequests);
    const index = this.sentRequests.findIndex(req => req.id === userid);
    if (index >= 0) {
      return true;
    }
    return false;
  }

  checkForFriends(userid) {
    const index = this.friends.findIndex(frnd => frnd.id === userid);
    if (index >= 0) {
      return true;
    }
    return false;
  }

}
