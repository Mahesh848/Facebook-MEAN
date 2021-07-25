import { Notification } from './../../interfaces/notification';
import { Message } from './../../interfaces/message';
import { AuthService } from './../../services/auth/auth.service';
import { ChatService } from './../../services/chat/chat.service';
import { DataShareService } from './../../services/data-share/data-share.service';
import { FriendRequest } from './../../interfaces/friend-request';
import { FormGroup } from '@angular/forms';
import { FormService } from './../../services/form/form.service';
import { SocketService } from './../../services/socket/socket.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { User } from 'src/app/interfaces/user';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userid = '';
  username = '';
  userprofile = '';
  unreadNotifications = 0;
  unreadMessages = 0;
  unreadRequests = 0;
  receivedRequests: FriendRequest[] = [];
  sentRequests: FriendRequest[] = [];

  user: User = null;

  peopleYouMayKnow: User[] = [];
  friends: FriendRequest[] = [];

  searchForm: FormGroup = null;

  newMessages: Message[] = [];
  oldMessages: Message[] = [];

  notifications: Notification[] = [];

  inMessenger = false;
  inFriendrequests = false;
  inNotification = false;

  constructor(private socketService: SocketService,
              private router: Router,
              private formService: FormService,
              private chatService: ChatService,
              private datashareService: DataShareService,
              private authService: AuthService
              ) {

    this.userid = localStorage.getItem('userid');
    this.username = localStorage.getItem('username');
    this.searchForm = this.formService.createSearchForm();

    this.socketService.connectToSocket(this.userid);
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
    const component = this;
    $(document).ready(function() {
      $('.counter')
            .css({ opacity: 0 })
            .css({ top: '-10px' })
            .animate({ top: '-2px', opacity: 1 }, 500);
      $('#settings-btn').click(function() {
        if ($('.friendrequest-container').is(':visible')) {
          $('.friendrequest-container').hide();
          component.clearAllRequests();
        }
        if ($('.options').is(':visible')) {
          $('.options').hide();
        }
        if ($('.notification-container').is(':visible')) {
          $('.notification-container').hide();
          component.inNotification = false;
          component.makeSeenNotifications();
        }
        if ($('.message-container').is(':visible')) {
          $('.message-container').hide();
          component.inMessenger = false;
        }
        $('.options').fadeToggle('fast', 'linear', function() {

        });
        return false;
      });
      $(document).click(function () {
        if ($('.friendrequest-container').is(':visible')) {
          $('.friendrequest-container').hide();
          component.clearAllRequests();
        }
        if ($('.options').is(':visible')) {
          $('.options').hide();
        }
        if ($('.notification-container').is(':visible')) {
          $('.notification-container').hide();
          component.inNotification = false;
          component.makeSeenNotifications();
        }
        if ($('.message-container').is(':visible')) {
          component.inMessenger = false;
          $('.message-container').hide();
        }
      });

      $('.notification-btn').click(function() {
        component.inNotification = true;
        component.unreadNotifications = 0;
        if ($('.friendrequest-container').is(':visible')) {
          $('.friendrequest-container').hide();
          component.clearAllRequests();
        }
        if ($('.options').is(':visible')) {
          $('.options').hide();
        }
        if ($('.message-container').is(':visible')) {
          component.inMessenger = false;
          $('.message-container').hide();
        }
        $('.notification-container').fadeToggle('fast', 'linear', function() {

        });
        return false;
      });

      $('.notification-container').click(function() {
        return false;
      });

      $('.friendrequest-btn').click(function() {
        if ($('.options').is(':visible')) {
          $('.options').hide();
        }
        if ($('.notification-container').is(':visible')) {
          $('.notification-container').hide();
          component.inNotification = false;
          component.makeSeenNotifications();
        }
        if ($('.message-container').is(':visible')) {
          $('.message-container').hide();
          component.inMessenger = false;
        }
        component.unreadRequests = 0;
        $('.friendrequest-container').fadeToggle('fast', 'linear', function() {

        });
        return false;
      });

      $('.friendrequest-container').click(function() {
        return false;
      });

      $('.messenger-btn').click(function() {
        if ($('.options').is(':visible')) {
          $('.options').hide();
        }
        if ($('.notification-container').is(':visible')) {
          $('.notification-container').hide();
          component.inNotification = false;
          component.makeSeenNotifications();
        }
        if ($('.friendrequest-container').is(':visible')) {
          $('.friendrequest-container').hide();
          component.clearAllRequests();
        }
        component.inMessenger = true;
        component.unreadMessages = 0;
        $('.message-container').fadeToggle('fast', 'linear', function() {

        });
        return false;
      });

      $('.message-container').click(function() {
        return false;
      });

      $('.seeAll').click(function() {
        if ($('.friendrequest-container').is(':visible')) {
          $('.friendrequest-container').hide();
          component.clearAllRequests();
        }
        if ($('.message-container').is(':visible')) {
          $('.message-container').hide();
        }
        if ($('.notification-container').is(':visible')) {
          $('.notification-container').hide();
          component.makeSeenNotifications();
        }
      });
    });

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
      (response: any) => {
        const index = this.sentRequests.findIndex(req => req.id === response.id);
        this.sentRequests[index].read = true;
        this.friends.push(response);
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

    this.socketService.unfriendResponse().subscribe(
      (response: string) => {
        this.friends = this.friends.filter(frnd => frnd.id !== response);
      },
      (error) => {
        throw error;
      }
    );

    this.chatService.getAllMessages(this.userid).subscribe(
      (response: Message[]) => {
        console.log(response);
        response.forEach(msge => {
          const i = this.newMessages.findIndex(m => m.from === msge.from);
          const j = this.oldMessages.findIndex(m => m.from === msge.from);
          if (!msge.read) {
            this.unreadMessages++;
          }
          if (i < 0 && j < 0) {
            if (!msge.read) {
              this.newMessages.push(msge);
            } else {
              this.oldMessages.push(msge);
            }
          }
        });
      },
      (error) => {
        throw error;
      }
    );

    this.socketService.messageResponse().subscribe(
      (response: Message) => {
        const i = this.newMessages.findIndex(m => m.from === response.from);
        if (i >= 0) {
          this.newMessages[i].message = response.message;
        } else {
          const j = this.oldMessages.findIndex(m => m.from === response.from);
          if (j >= 0) {
            this.oldMessages = this.oldMessages.filter(msge => msge.from !== response.from);
            this.newMessages.unshift(response);
          }
        }
      }
    );

    this.chatService.getAllNotifications(this.userid).subscribe(
      (response: Notification[]) => {
        this.notifications = response;
        this.notifications.forEach(n => {
          if (!n.read) {
            this.unreadNotifications++;
          }
        });
      }
    );

    this.socketService.notification().subscribe(
      (response: Notification) => {
        this.notifications.unshift(response);
        this.unreadNotifications++;
      }
    );

  }

  gotoProfile() {
    this.inMessenger = false;
    this.router.navigate(['/pages/home/showuserdetails', this.userid]);
  }

  gotoHome() {
    this.inMessenger = false;
    this.router.navigate(['/pages/home']);
  }

  gotoFriendsRequest() {
    this.inMessenger = false;
    this.router.navigate(['/pages/home/friendrequest']);
  }

  gotoMessenger() {
    this.router.navigate(['/pages/home/messenger']);
  }

  gotoNotifications() {
    this.router.navigate(['/pages/home/notifications']);
  }

  gotoAbout() {
    this.router.navigate(['/pages/home/aboutus']);
  }

  getPostDetails(postid) {
    this.router.navigate(['/pages/home/postdetails', postid]);
  }

  clearAllRequests() {
    this.sentRequests = this.sentRequests.filter(req => req.read !== true);
    this.receivedRequests.forEach(req => {
      if (req.read) {
        req.read = true;
      }
    });
    this.chatService.clearAllRequests(this.userid).subscribe(
      (response: string) => {
        console.log(response);
      },
      (error) => {
        console.log('error');
      }
    );
  }

  makeSeenNotifications() {
    this.socketService.makeSeenNotifications(this.userid);
    for (let i = 0; i < this.notifications.length; i++) {
      if (!this.notifications[i].read) {
        this.notifications[i].read = true;
      } else {
        break;
      }
    }
  }

  gotoTimeline() {
    this.inMessenger = false;
    this.router.navigate(['/pages/home/timeline']);
  }

  search() {
    this.inMessenger = false;
    const searchtext = this.searchForm.get('search').value;
    // alert(searchtext);
    this.router.navigate(['/pages/home/search', searchtext]);
  }

  acceptFriendrequest(sen) {
    const sender = {
      id: sen.id,
      name: sen.name,
      profile: sen.profile,
      gender: sen.gender
    };
    const reciever = {
      id: this.userid,
      name: this.username,
      profile: this.userprofile,
      gender: this.user.gender
    };
    this.receivedRequests = this.receivedRequests.filter(req => req.id !== sen.id);
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

  getProfileOfSender(userid) {
    const index = this.friends.findIndex(frnd => frnd.id === userid);
    if (index >= 0) {
      return this.friends[index].profile;
    }
    return '';
  }

  getNameOfSender(userid) {
    const index = this.friends.findIndex(frnd => frnd.id === userid);
    if (index >= 0) {
      return this.friends[index].name;
    }
    return '';
  }

  logout() {
    this.socketService.logOut(this.userid).subscribe(
      (response: any) => {
        if (response.error) {
          alert('Something Went Wrong..!!');
        } else {
          localStorage.clear();
          this.datashareService.changeSelectedUser(null);
          this.router.navigate(['/']);
        }
      }
    );
  }
}
