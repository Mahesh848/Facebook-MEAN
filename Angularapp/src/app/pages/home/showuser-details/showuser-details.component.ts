import { User } from './../../../interfaces/user';
import { AuthService } from './../../../services/auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-showuser-details',
  templateUrl: './showuser-details.component.html',
  styleUrls: ['./showuser-details.component.css']
})
export class ShowuserDetailsComponent implements OnInit {

  user: User = null;
  userid = '';
  edit = false;

  profile: File = null;
  profileUrl = '';

  constructor(private router: Router,
              private authService: AuthService
    ) {
      this.userid = localStorage.getItem('userid');
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
  }

  change() {
    this.edit = true;
  }

  public profileOnchangeFunc(event) {
    if (event.target.files && event.target.files[0]) {
      this.profile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  saveUser() {
    const userForm = new FormData();
    userForm.append('id', this.user._id);
    userForm.append('firstname', this.user.firstname);
    userForm.append('surname', this.user.surname);
    userForm.append('username', this.user.username);
    userForm.append('password', this.user.password);
    userForm.append('dob', this.user.dob.toString());
    if (this.profile !== null) {
      userForm.append('profile', this.profile, this.profile.name);
    }
    this.authService.updateUser(userForm).subscribe(
      (response: any) => {
        if (!response.error) {
          if (response.profile !== 'not change') {
            this.user.profile = response.profile;
          }
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        throw error;
      }
    );
    this.edit = false;
  }
}
