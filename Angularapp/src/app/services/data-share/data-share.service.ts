import { MessengerUser } from './../../interfaces/messenger-user';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  private user = new BehaviorSubject(null);
  selectedUser: Observable<MessengerUser> = this.user.asObservable();

  constructor() { }

  changeSelectedUser(u: MessengerUser) {
    this.user.next(u);
  }

}
