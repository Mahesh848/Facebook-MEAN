import { AuthResponse } from './../../interfaces/auth-response';
import { AuthService } from './../../services/auth/auth.service';
import { FormService } from './../../services/form/form.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  registerForm: FormGroup = null;
  loginForm: FormGroup = null;

  constructor(private formService: FormService,
              private authService: AuthService,
              private router: Router) {
    this.registerForm = this.formService.createRegisterForm();
    this.loginForm = this.formService.createLoginForm();
  }

  ngOnInit() {
  }

  public register(): void {
    this.authService.register(this.registerForm.value).subscribe(
      (response: AuthResponse) => {
        localStorage.setItem('userid', response.userid);
        localStorage.setItem('username', response.fullname);
        this.router.navigate(['/pages/home']);
      },
      (error) => {
        alert('Something Went Wrong... Please Try Again Later..');
      }
    );
  }

  public login(): void {
    this.authService.login(this.loginForm.value).subscribe(
      (response: AuthResponse) => {
        localStorage.setItem('userid', response.userid);
        localStorage.setItem('username', response.fullname);
        this.router.navigate(['/pages/home']);
      },
      (error) => {
        alert('Something Went Wrong... Please Try Again Later..');
      }
    );
  }


}
