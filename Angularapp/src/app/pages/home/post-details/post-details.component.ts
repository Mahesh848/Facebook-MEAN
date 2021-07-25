import { FormGroup } from '@angular/forms';
import { FormService } from './../../../services/form/form.service';
import { SocketService } from './../../../services/socket/socket.service';
import { PostService } from './../../../services/post/post.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from './../../../interfaces/post';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  post: Post = null;
  postid = '';

  userprofile = '';
  userid = '';
  username = '';

  public date: Date;
  commentForm: FormGroup = null;

  @ViewChild('comments') private commentsContainer: ElementRef;

  constructor(private router: ActivatedRoute,
              private postService: PostService,
              private socketService: SocketService,
              private formService: FormService
  ) {
                this.userid = localStorage.getItem('userid');
                this.username = localStorage.getItem('username');
                this.commentForm = this.formService.createCommentForm();

                setInterval(() => {
                  this.date = new Date();
                }, 1000);
    }

  ngOnInit() {
    this.postid = this.router.snapshot.paramMap.get('id');
    this.postService.getPostDetails(this.postid).subscribe(
      (response: any) => {
        if (!response.error) {
          this.post = response.post;
        } else {
          console.log('error');
        }
      }
    );
    this.scrollCommentsContainer();
    this.socketService.requestForProfile(this.userid).subscribe(
      (response: string) => {
        this.userprofile = response;
        return;
      },
      (error) => {
        console.log(error);
      }
    );
    this.socketService.commentResponse().subscribe(
      (response: any) => {
        if (this.postid === response.postid) {
          const comment = {
            userid: response.userid,
            username: response.username,
            userprofile: response.userprofile,
            comment: response.comment
          };
          this.post.noOfcomments = this.post.noOfcomments + 1;
          this.post.comments.push(comment);
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.socketService.likeResponse().subscribe(
      (response: any) => {
        const userid = response.userid;
        if (this.postid === response.postid) {
          if (response.likes < this.post.noOflikes) {
            this.post.likedBy = this.post.likedBy.filter(uid => uid !== response.userid);
          } else {
            this.post.likedBy.push(response.userid);
          }
          this.post.noOflikes = response.likes;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  like(postid) {
      if (this.post.likedBy.includes(this.userid)) {
        this.socketService.likeRequest(postid, this.userid, false);
        return;
     }
    this.socketService.likeRequest(postid, this.userid, true);
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
      return agotime_d + ' d';
    } else if (agotime_h > 0) {
      return agotime_h + ' hrs';
    } else if (agotime_m > 0) {
      return agotime_m + ' mins';
    } else {
      return 'few secs';
    }
  }

  uploadComment(postid) {
    const comment = this.commentForm.get('comment').value;
    this.socketService.commentRequest(postid, this.userid, this.username, this.userprofile, comment);
    this.scrollCommentsContainer();
    this.commentForm.controls['comment'].setValue('');
  }

  scrollCommentsContainer(): void {
    if (this.commentsContainer !== undefined) {
      try {
        setTimeout(() => {
          this.commentsContainer.nativeElement.scrollTop = this.commentsContainer.nativeElement.scrollHeight;
        }, 100);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  likedOrNot(postid) {
    if (this.post.likedBy.includes(this.userid)) {
      return true;
    }
    return false;
  }

}
