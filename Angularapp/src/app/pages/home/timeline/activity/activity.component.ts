import { Router } from '@angular/router';
import { Post } from 'src/app/interfaces/post';
import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  userid = '';
  posts: Post[] = [];

  public date: Date;

  constructor(private postService: PostService, private router: Router) {
    this.userid = localStorage.getItem('userid');

    setInterval(() => {
      this.date = new Date();
    }, 1000);
   }

  ngOnInit() {
    this.postService.getAllActivities(this.userid).subscribe(
      (response: any) => {
        this.posts = response.activities;
        this.posts.forEach(post => {
          post.likedBy = post.likedBy.filter(like => like === this.userid);
          post.comments = post.comments.filter(comment => comment.userid === this.userid);
        });
        // console.log(this.posts);
      },
      (error) => {
        throw error;
      }
    );
  }

  getTime(uploaded_date) {
    const date1 = new Date(uploaded_date).getTime();
    const date2 = this.date.getTime();
    const agotime_ms = date2 - date1;
    const agotime_s = Math.floor(agotime_ms / 1000);
    const agotime_m = Math.floor(agotime_s / 60);
    const agotime_h = Math.floor(agotime_m / 60);
    const agotime_d = Math.floor(agotime_h / 24);
    if (agotime_d > 0) {
      return agotime_d + ' days';
    } else if (agotime_h > 0) {
      return agotime_h + ' hrs';
    } else if (agotime_m > 0) {
      return agotime_m + ' mins';
    } else {
      return 'few secs';
    }
  }

  getPostDetails(postid) {
    this.router.navigate(['/pages/home/postdetails', postid]);
  }

}
