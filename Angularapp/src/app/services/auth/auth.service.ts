import { User } from './../../interfaces/user';
import { LoginRequest } from './../../interfaces/login-request';
import { AuthResponse } from './../../interfaces/auth-response';
import { SignupRequest } from './../../interfaces/signup-request';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  private BASE_URL = `http://localhost:1848/`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  register(registerForm: SignupRequest): Observable<AuthResponse> {
    return this.http.post(`${this.BASE_URL}register`, JSON.stringify(registerForm), this.httpOptions).pipe(
      map(
        (response: AuthResponse) => {
          return response;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  login(loginForm: LoginRequest): Observable<AuthResponse> {
    return this.http.post(`${this.BASE_URL}login`, JSON.stringify(loginForm), this.httpOptions).pipe(
      map(
        (response: AuthResponse) => {
          return response;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  getUserDetails(userid): Observable<User> {
    return this.http.post(`${this.BASE_URL}getuserdetails`, {userid: userid}, this.httpOptions).pipe(
      map(
        (response: User) => {
          return response;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  updateUser(user: FormData): Observable<any> {
    return this.http.post(`${this.BASE_URL}updateuserdetails`, user).pipe(
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

  canActivate(): boolean {
    const userid = localStorage.getItem('userid');
    if (userid === '' || userid === undefined || userid === null) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }

}
