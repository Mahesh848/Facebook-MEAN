import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  userid = '';
  username = '';
  userProfile = '';

  constructor(private socketService: SocketService, private router: Router) {
    this.username = localStorage.getItem('username');
    this.userid = localStorage.getItem('userid');
  }

  ngOnInit() {
    this.socketService.requestForProfile(this.userid).subscribe(
      (response: string) => {
        this.userProfile = response;
      },
      (error) => {
        throw error;
      }
    );
  }

  gotoTimeline() {
    this.router.navigate(['/pages/home/timeline/activity']);
  }

  gotoFriends() {
    this.router.navigate(['/pages/home/timeline/friends']);
  }
}
