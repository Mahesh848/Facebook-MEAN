import { Notification } from './../../interfaces/notification';
import { MessengerUser } from './../../interfaces/messenger-user';
import { Message } from './../../interfaces/message';
import { FriendRequest } from './../../interfaces/friend-request';
import { User } from './../../interfaces/user';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  private BASE_URL = `http://localhost:1848/`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };

  search(searchtext): Observable<any> {
    return this.http.post(`${this.BASE_URL}search`, {searchtext: searchtext}, this.httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  getAllFriendRequests(userid): Observable<any> {
    return this.http.post(`${this.BASE_URL}getallfriendrequests`, {userid: userid}, this.httpOptions).pipe(
      map(
        (response: any) => {
          return response;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  clearAllRequests(userid): Observable<string> {
      return this.http.post(`${this.BASE_URL}clearallrequests`, {userid: userid}, this.httpOptions).pipe(
        map(
          (response: any) => {
            return response.message;
          },
          (error) => {
            throw error;
          }
        )
      );
  }

  deleteSentFriendrequest(sender, reciever): Observable<string> {
    return this.http.post(`${this.BASE_URL}deletesentfriendrequest`, {sender: sender, reciever: reciever}, this.httpOptions).pipe(
      map(
        (response: any) => {
          return response.sender;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  peopleYouMayKnow(userid): Observable<User[]> {
    return this.http.post(`${this.BASE_URL}peopleyoumayknow`, {userid: userid}, this.httpOptions).pipe(
      map(
        (response: any) => {
          return response.people;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  getAllFriends(userid): Observable<FriendRequest[]> {
    return this.http.post(`${this.BASE_URL}getallfriends`, {userid: userid}, this.httpOptions).pipe(
      map(
        (response: any) => {
          if (!response.error) {
            return response.friends;
          } else {
            alert('error');
          }
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  getAllChatFriends(userid): Observable<MessengerUser[]> {
    return this.http.post(`${this.BASE_URL}getallchatfriends`, {userid: userid}, this.httpOptions).pipe(
      map(
        (response: any) => {
          if (!response.error) {
            return response.friends;
          } else {
            alert('error');
          }
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  getConversation(userid1, userid2): Observable<Message[]> {
    return this.http.post(`${this.BASE_URL}getconversation`, {userid1: userid1, userid2: userid2}, this.httpOptions).pipe(
      map(
        (response: any) => {
          return response.conversation;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  getAllMessages(userid): Observable<Message[]> {
    return this.http.post(`${this.BASE_URL}getunreadmessages`, {userid: userid}, this.httpOptions).pipe(
      map(
        (response: any) => {
          return response.messages;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  getAllNotifications(userid): Observable<Notification[]> {
    return this.http.post(`${this.BASE_URL}getnotifications`, {userid: userid}, this.httpOptions).pipe(
      map(
        (response: any) => {
          return response.notifications;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

}
