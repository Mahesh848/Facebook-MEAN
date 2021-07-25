import { Error } from './../../interfaces/error';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Posts } from 'src/app/interfaces/posts';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  private BASE_URL = `http://localhost:1848/`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };

  postAnImage(post: FormData): Observable<Error> {
    // console.log(post.get('uploader'));
    return this.http.post(`${this.BASE_URL}uploadpost`, post).pipe(
      map(
        (response: Error) => {
          return response;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  getAllPosts(): Observable<Posts> {
    return this.http.post(`${this.BASE_URL}getallposts`, this.httpOptions).pipe(
      map(
        (response: Posts) => {
          // console.log(response);
          return response;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  getUploaderName(userid): Observable<string> {
    return this.http.post(`${this.BASE_URL}getusername`, {userid: userid} , this.httpOptions).pipe(
      map(
        (response: any) => {
          return response.userid;
        },
        (error) => {
          throw error;
        }
      )
    );
  }

  getPostDetails(postid): Observable<any> {
    return this.http.post(`${this.BASE_URL}getpostdetails`, {postid: postid}, this.httpOptions).pipe(
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

  getAllActivities(userid): Observable<any> {
    return this.http.post(`${this.BASE_URL}getallactivities`, {userid: userid}, this.httpOptions).pipe(
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

}
