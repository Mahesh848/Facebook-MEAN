import { Notification } from './../../interfaces/notification';
import { Message } from './../../interfaces/message';
import { User } from './../../interfaces/user';
import { FriendRequest } from './../../interfaces/friend-request';
import { Comment } from './../../interfaces/comment';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Post } from 'src/app/interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { }

  private socket;
  private BASE_URL = `http://localhost:1848/`;

  connectToSocket(userid: string) {
    this.socket = io(this.BASE_URL, {query: `userid=${userid}`});
    this.logIn(userid);
  }

  logIn(userid) {
    this.socket.emit('login', {userid: userid});
  }

  requestForProfile(userid): Observable<string> {
    // console.log(userid);
    this.socket.emit('profile-request', {userid: userid});
    return new Observable( observer => {
      this.socket.on('profile-response', (data: string) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  commentRequest(postid, userid, username, userprofile, comment) {
    this.socket.emit('comment-request', {postid: postid, userid: userid, username: username, userprofile: userprofile, comment: comment});
  }

  commentResponse(): Observable<any> {
    return new Observable( observer => {
      this.socket.on('comment-response', (data: Comment) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  likeRequest(postid, userid, inc) {
    this.socket.emit('like-request', {postid: postid, userid: userid, inc: inc});
  }

  likeResponse(): Observable<any> {
    return new Observable( observer => {
      this.socket.on('like-response', (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  sharePostRequest(post) {
    this.socket.emit('sharepost-request', {post: post});
  }

  sharePostResponse(): Observable<Post> {
    return new Observable( observer => {
      this.socket.on('sharepost-response', (data: Post) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  friendrequestRequest(sentFriendreq, receivedFriendreq) {
    this.socket.emit('friendrequest-request', {sentFriendreq: sentFriendreq, recievedFriendreq: receivedFriendreq});
  }

  sentFriendrequestResponse() {
    return new Observable (observer => {
      this.socket.on('sentfriendrequest-response', (data: FriendRequest) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  receivedFriendrequestResponse() {
    return new Observable (observer => {
      this.socket.on('recievedfriendrequest-response', (data: FriendRequest) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  deleteFriendrequest(sender, reciever) {
    this.socket.emit('deletefriendrequest-request', {sender: sender, reciever: reciever});
  }

  deleteReceivedFriendrequestResponse() {
    return new Observable (observer => {
      this.socket.on('deleterecievedfriendrequest-response', (data: string) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  deleteSentFriendrequestResponse() {
    return new Observable (observer => {
      this.socket.on('deletesentfriendrequest-response', (data: string) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  acceptFriendrequestRequest(sender, reciever) {
    this.socket.emit('acceptfriendrequest-request', {sender: sender, reciever: reciever});
  }

  acceptFriendrequestResponse() {
    return new Observable (observer => {
      this.socket.on('acceptfriendrequest-response', (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  deleteAcceptedFriendrequestResponse() {
    return new Observable (observer => {
      this.socket.on('deleteacceptedrequest-response', (data: string) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  unfriendRequest(sender, reciever) {
    this.socket.emit('unfriend-request', {sender: sender, reciever: reciever});
  }

  unfriendResponse(): Observable<string> {
    return new Observable (observer => {
      this.socket.on('unfriend-response', (data: string) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  chatListResponse(): Observable <User> {
    return new Observable (observer => {
      this.socket.on('chatlist-response', (data: User) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
  makeOffline(): Observable <any> {
    return new Observable (observer => {
      this.socket.on('make-offline', (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  messageRequest(message: Message) {
    this.socket.emit('message-request', {message: message});
  }

  messageResponse(): Observable<Message> {
    return new Observable (observer => {
      this.socket.on('message-response', (data: Message) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  makeseenRequest(from, to) {
    this.socket.emit('makeseen-request', {from: from, to: to});
  }

  makeseenResponse(): Observable<string> {
    return new Observable (observer => {
      this.socket.on('makeseen-response', (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  notification(): Observable<Notification> {
    return new Observable (observer => {
      this.socket.on('notification', (data: Notification) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  makeSeenNotifications(userid) {
    this.socket.emit('makeseen-notification', {userid: userid});
  }

  logOut(userid): Observable<any> {
    this.socket.emit('logout-request', {userid: userid});
    return new Observable ( observer => {
      this.socket.on('logout-response', (data: any) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
