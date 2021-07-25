import { ChatService } from './../../../services/chat/chat.service';
import { SocketService } from './../../../services/socket/socket.service';
import { AuthService } from './../../../services/auth/auth.service';
import { FriendRequest } from './../../../interfaces/friend-request';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css']
})
export class FriendRequestComponent implements OnInit {

  userid = '';
  username = '';
  userprofile = '';

  unreadRequests = 0;

  receivedRequests: FriendRequest[] = null;
  sentRequests: FriendRequest[] = null;

  user: User = null;

  peopleYouMayKnow: User[] = [];
  friends: FriendRequest[] = [];

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private chatService: ChatService
  ) {
    this.userid = localStorage.getItem('userid');
    this.username = localStorage.getItem('username');
    this.socketService.requestForProfile(this.userid).subscribe(
      (response: string) => {
        // console.log(response);
        this.userprofile = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
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
          this.sentRequests.forEach(req => {
            if (req.read === true) {
              this.unreadRequests++;
            }
          });
          this.receivedRequests.forEach(req => {
            if (req.read === false) {
              this.unreadRequests++;
            }
          });
          // alert(this.unreadRequests);
        } else {
          console.log('Error');
        }
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

    this.chatService.peopleYouMayKnow(this.userid).subscribe(
      (response: User[]) => {
        this.peopleYouMayKnow = response;
        this.peopleYouMayKnow = this.peopleYouMayKnow.filter(friend => {
          if (friend._id === this.userid) {
            return false;
          } else {
            const i1 = this.friends.findIndex(frnd => frnd.id === friend._id);
            if (i1 >= 0) {
              return false;
            }
            const i2 = this.sentRequests.findIndex(req => req.id === friend._id);
            if (i2 >= 0) {
              return false;
            }
            const i3 = this.receivedRequests.findIndex(req => req.id === friend._id);
            if (i3 >= 0) {
              return false;
            }
            if (i1 < 0 && i2 < 0 && i3 < 0) {
              return true;
            }
          }
        });
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

    this.socketService.receivedFriendrequestResponse().subscribe(
      (response: FriendRequest) => {
          this.receivedRequests.unshift(response);
          this.unreadRequests++;
          // console.log(this.receivedRequests);
      },
      (error) => {
        throw error;
      }
    );

    this.socketService.sentFriendrequestResponse().subscribe(
      (response: FriendRequest) => {
          this.sentRequests.unshift(response);
          // console.log(this.sentRequests);
          this.peopleYouMayKnow = this.peopleYouMayKnow.filter(person => person._id !== response.id);
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

    this.socketService.acceptFriendrequestResponse().subscribe(
      (response: string) => {
        const index = this.sentRequests.findIndex(req => req.id === response);
        this.sentRequests[index].read = true;
        this.unreadRequests++;
      },
      (error) => {
        throw error;
      }
    );

    this.socketService.deleteAcceptedFriendrequestResponse().subscribe(
      (response: string) => {
        this.receivedRequests = this.receivedRequests.filter(req => req.id !== response);
      },
      (error) => {
        throw(error);
      }
    );

  }

  acceptFriendrequest(sender) {
    const reciever = {
      id: this.userid,
      name: this.username,
      profile: this.userprofile,
      gender: this.user.gender
    };
    this.socketService.acceptFriendrequestRequest(sender, reciever);
  }

  deleteFriendrequest(sender) {
    const reciever = {
      id: this.userid,
      name: this.username,
      profile: this.userprofile
    };
    this.chatService.deleteSentFriendrequest(sender, reciever).subscribe(
      (response: string) => {
        this.receivedRequests = this.receivedRequests.filter(req => req.id !== response);
      },
      (error) => {
        throw error;
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

}
