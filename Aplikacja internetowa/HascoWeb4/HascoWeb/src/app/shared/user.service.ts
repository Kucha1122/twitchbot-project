import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { Timeout } from './timeout';
import { Time } from './Time';

import { catchError } from 'rxjs/operators';
import { Phrase } from './Phrase';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  endpoint: string = 'https://localhost:5001/users';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http: HttpClient, public router: Router) { }
  /*
    connectToChannel() {
      let api = `${this.endpoint}/connect`;
      return this.http.post(api)
        .pipe(
          catchError(this.handleError)
        )
    }
    */

  connectToChannel() {
    let api = `${this.endpoint}/connect`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        localStorage.setItem('isConnected', 'true');
      })
  }

  disconnectFromChannel() {
    let api = `${this.endpoint}/disconnect`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        localStorage.removeItem('isConnected');
      })
  }

  /*
  sendMessageOnChat(message: string) {
    let api = `${this.endpoint}/message`;
    return this.http.post(api, message)
      .pipe(
        catchError(this.handleError)
      )
  }
  */
  sendMessageOnChat(message: string) {
    let api = `${this.endpoint}/message`;
    return this.http.post<any>(api, message)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.router.navigate(['dashboard'])
      })
  }

  timeoutUser(timeout: Timeout) {
    let api = `${this.endpoint}/timeout`;
    return this.http.post<any>(api, timeout)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.router.navigate(['dashboard'])
      })
  }

  setFollowersModOn(time: Time) {
    let api = `${this.endpoint}/followers/on`;
    return this.http.post<any>(api, time)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.router.navigate(['dashboard/settings'])
        localStorage.setItem('followers-mod', 'true')
      })
  }

  setFollowersModOff() {
    let api = `${this.endpoint}/followers/off`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        localStorage.setItem('followers-mod', 'false')
      })
  }

  setSlowModOn(time: Time) {
    let api = `${this.endpoint}/slow/on`;
    return this.http.post<any>(api, time)
      .pipe(catchError(this.handleError))
      .subscribe((res): any => {
        this.router.navigate(['dashboard/'])
        localStorage.setItem('slow-mod', 'true');
      })
  }

  setSlowModOff() {
    let api = `${this.endpoint}/slow/off`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res): any => {
        localStorage.setItem('slow-mod', 'false');
      })
  }

  setSubscribersModOn() {
    let api = `${this.endpoint}/subscribers/on`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        localStorage.setItem('subscribers-mod', 'true')
      })
  }
  setSubscribersModOff() {
    let api = `${this.endpoint}/subscribers/off`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        localStorage.setItem('subscribers-mod', 'false')
      })
  }

  setEmoteOnlyOn() {
    let api = `${this.endpoint}/emoteonly/on`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        localStorage.setItem('emoteonly-mod', 'true')
      })
  }

  setEmoteOnlyOff() {
    let api = `${this.endpoint}/emoteonly/off`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        localStorage.setItem('emoteonly-mod', 'false')
      })
  }

  clearChat() {
    let api = `${this.endpoint}/clearchat`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        console.log('Chat is cleared');
        this.router.navigate(['dashboard']);
      })
  }

  startGiveaway() {
    let api = `${this.endpoint}/giveaway/start`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {

      })
  }

  drawTheWinner() {
    let api = `${this.endpoint}/giveaway/winner`;
    return this.http.post<any>(api, null)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.router.navigate(['dashboard']);
      })
  }

  addPhraseToBlock(phrase: Phrase) {
    let api = `${this.endpoint}/phrase/add`;
    return this.http.post<any>(api, phrase)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        //this.router.navigate(['dashboard']);
      })
  }

  removePhrase(phrase: Phrase) {
    let api = `${this.endpoint}/phrase/remove`;
    return this.http.post<any>(api, phrase)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        //this.router.navigate(['dashboard']);
      })
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
