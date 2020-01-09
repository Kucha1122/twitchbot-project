import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint: string = 'https://localhost:5001/users';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http: HttpClient, public router: Router) { }

  //Register
  signUp(user: User) {
    let api = `${this.endpoint}/register`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      )
  }
  /*
  public signUp(user: User) {
    return this.http.post(`${this.endpoint}/register`, user);
  }
  */
  //Login dla testu zamiast przekierowywac do dashboard wrzuci get channels
  signIn(user: User) {
    return this.http.post<any>(`${this.endpoint}/authenticate`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token)
        localStorage.setItem('channel-name', res.channelName)
        this.router.navigate(['dashboard']);
      })
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggenIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken != null) ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    localStorage.removeItem('channel-name');
    localStorage.removeItem('isConnected');
    if (removeToken == null) {
      this.router.navigate(['mainpage']);
    }
  }

  getUserProfile(id): Observable<any> {
    let api = `${this.endpoint}/user-profile/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      //client-side error
      msg = error.error.message;
    } else {
      //server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }

    return throwError(msg);
  }

}
