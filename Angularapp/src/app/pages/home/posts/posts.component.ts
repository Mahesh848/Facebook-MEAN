import { ChatService } from './../../../services/chat/chat.service';
import { FriendRequest } from './../../../interfaces/friend-request';
import { Router } from '@angular/router';
import { SocketService } from './../../../services/socket/socket.service';
import { FormService } from './../../../services/form/form.service';
import { FormGroup } from '@angular/forms';
import { Posts } from 'src/app/interfaces/posts';
import { Post } from './../../../interfaces/post';
import { Error } from './../../../interfaces/error';
import { PostService } from './../../../services/post/post.service';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  postImage: File = null;
  postDesc = '';
  postUrl = '';
  posts: Post[] = [];
  sharePost: any = {};

  userprofile = '';
  userid = '';
  username = '';

  public date: Date;
  commentForm: FormGroup = null;

  friends: FriendRequest[] = [];

  constructor(
    private postService: PostService,
    private formService: FormService,
    private socketService: SocketService,
    private router: Router,
    private chatService: ChatService
  ) {
    this.commentForm = this.formService.createCommentForm();

    this.userid = localStorage.getItem('userid');
    this.username = localStorage.getItem('username');
    this.socketService.requestForProfile(this.userid).subscribe(
      (response: string) => {
        this.userprofile = response;
        return;
      },
      (error) => {
        console.log(error);
      }
    );

    setInterval(() => {
      this.date = new Date();
    }, 1000);

  }

  ngOnInit() {

    $(document).ready(function() {
      $('.bodi').on('click', '.share', function() {
        $(this).children('.sharing').fadeToggle('fast', 'linear', function() {

        });
        return false;
      });
      $(document).click(function() {
        $('.sharing').hide();
      });
    });

    this.getAllPosts();

    this.socketService.sharePostResponse().subscribe(
      (response: Post) => {
        this.posts.unshift(response);
        console.log(this.posts);
      },
      (error) => {
        console.log('error');
      }
    );

    this.socketService.commentResponse().subscribe(
      (response: any) => {
        const comment = {
          userid: response.userid,
          username: response.username,
          userprofile: response.userprofile,
          comment: response.comment
        };
        const index = this.posts.findIndex((obj: Post) => obj._id === response.postid);
        if (index >= 0) {
          this.posts[index].noOfcomments = this.posts[index].noOfcomments + 1;
          if (this.posts[index].comments.length >= 10) {
            this.posts[index].comments.shift();
            this.posts[index].comments[9] = comment;
          } else {
            this.posts[index].comments.push(comment);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.socketService.likeResponse().subscribe(
      (response: any) => {
        const userid = response.userid;
        const index = this.posts.findIndex((obj: Post) => obj._id === response.postid);
        if (index >= 0) {
          if (response.likes < this.posts[index].noOflikes) {
            this.posts[index].likedBy = this.posts[index].likedBy.filter(uid => uid !== response.userid);
          } else {
            this.posts[index].likedBy.push(response.userid);
          }
          this.posts[index].noOflikes = response.likes;
          // console.log(this.posts[index].likedBy);
        }
      },
      (error) => {
        console.log(error);
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

    this.socketService.acceptFriendrequestResponse().subscribe(
      (response: any) => {
        this.friends.push(response);
      },
      (error) => {
        throw error;
      }
    );
  }

  public postsOnchangeFunc(event) {
    if (event.target.files && event.target.files[0]) {
      this.postImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.postUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public uploadPost() {
    if (this.postImage !== null) {
      const postFormData = new FormData();
      postFormData.append('post', this.postImage, this.postImage.name);
      postFormData.append('uploader', localStorage.getItem('userid'));
      postFormData.append('description', this.postDesc);
      postFormData.append('uploadername', localStorage.getItem('username'));
      postFormData.append('uploaderprofile', this.userprofile);
      postFormData.append('uploadedDate', this.date.toString());
      // console.log(postFormData);
      this.postService.postAnImage(postFormData).subscribe(
        (response: Error) => {
          if (response.error) {
            console.log(response);
          } else {
            // console.log('Suceess');
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    return;
  }

  getAllPosts() {
    this.postService.getAllPosts().subscribe(
      (response: Posts) => {
        this.posts = response.posts;
        console.log(this.posts);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  uploadComment(postid) {
    const comment = this.commentForm.get('comment').value;
    this.socketService.commentRequest(postid, this.userid, this.username, this.userprofile, comment);
    this.commentForm.controls['comment'].setValue('');
  }

  like(postid) {
    const index = this.posts.findIndex((obj: Post) => obj._id === postid);
    if (index >= 0) {
      if (this.posts[index].likedBy.includes(this.userid)) {
        this.socketService.likeRequest(postid, this.userid, false);
        return;
      }
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
      if (agotime_d === 1) {
        return agotime_d + ' d';
      }
      return agotime_d + ' ds';
    } else if (agotime_h > 0) {
        if (agotime_h === 1) {
          return agotime_h + ' hr';
        }
        return agotime_h + ' hrs';
    } else if (agotime_m > 0) {
      if (agotime_m === 1) {
        return agotime_m + ' min';
      }
      return agotime_m + ' mins';
    } else {
      return 'few secs';
    }
  }

  getPostDetails(postid) {
    this.router.navigate(['/pages/home/postdetails', postid]);
  }

  likedOrNot(postid) {
    const index = this.posts.findIndex((obj: Post) => obj._id === postid);
    if (this.posts[index].likedBy.includes(this.userid)) {
      return true;
    }
    return false;
  }

  canIshow(post) {
    const index1 = this.friends.findIndex(frnd => frnd.id === post.uploader);
    const index2 = this.friends.findIndex(frnd => frnd.id === post.sharer);
    if (post.type === 3 || index2 >= 0 || index1 >= 0 || post.uploader === this.userid
       || (post.type === 2 && post.sharer === this.userid)) {
      return true;
    }
    return false;
  }

  shareApost(originalpost: Post, type) {
    const index = this.posts.findIndex(p => p._id === originalpost._id);
    if (this.posts[index].shares === undefined) {
      this.posts[index].shares = 0;
    }
    this.posts[index].shares = this.posts[index].shares + 1;
    if (originalpost.type === 1 || originalpost.type === 3 ) {
      this.sharePost.uploader = originalpost.sharer;
      this.sharePost.uploadername = originalpost.sharername;
      this.sharePost.uploaderprofile = originalpost.sharerprofile;
    } else {
      this.sharePost.uploader = originalpost.uploader;
      // console.log(originalpost);
      this.sharePost.uploadername = originalpost.uploadername;
      this.sharePost.uploaderprofile = originalpost.uploaderprofile;
    }
    this.sharePost.location = originalpost.location;
    this.sharePost.description = originalpost.description;
    this.sharePost.likedBy = [];
    this.sharePost.noOfcomments = 0;
    this.sharePost.noOflikes = 0;
    this.sharePost.shares = 0;
    this.sharePost.comments = [];
    this.sharePost.sharer = this.userid;
    this.sharePost.sharername = this.username;
    this.sharePost.sharerprofile = this.userprofile;
    this.sharePost.uploadedDate = new Date();
    if (type === 3) {
      this.sharePost.type = 3;
    } else {
      this.sharePost.type = 1;
    }
    console.log( this.sharePost);
    this.socketService.sharePostRequest(this.sharePost);
  }
}
