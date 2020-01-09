import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from './../../shared/user.service';
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  timeoutUserForm: FormGroup;
  sendMessageForm: FormGroup;
  customCommandsForm: FormGroup;
  giveawayForm: FormGroup;
  phraseAddForm: FormGroup;
  removePhraseForm: FormGroup;
  isGiveawayStarted: boolean = false;

  currentUser = localStorage.getItem('channel-name');
  twitchChatLink = `https://www.twitch.tv/embed/kubon_/chat`; // ${this.currentUser}
  liveStreamLink = `https://player.twitch.tv/?channel=kubon_&muted=true`; // ${this.currentUser}
  urlSafe: SafeResourceUrl;
  isConnected = localStorage.getItem('isConnected');

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string = ``;
  public now: Date = new Date();

  constructor(
    public fb: FormBuilder,
    public userService: UserService,
    public authService: AuthService,
    public router: Router,
    public sanitizer: DomSanitizer
  ) {
    this.timeoutUserForm = this.fb.group({
      UserName: [''],
      Seconds: ['']
    })
    this.sendMessageForm = this.fb.group({
      MessageToSend: ['']
    })
    this.customCommandsForm = this.fb.group({
      commandName: [''],
      response: ['']
    })
    this.giveawayForm = this.fb.group({
      giveawayKeyword: ['']
    })
    this.phraseAddForm = this.fb.group({
      Word: ['']
    })
    this.removePhraseForm = this.fb.group({
      Word: ['']
    })

    setInterval(() => {
      this.now = new Date();
    }, 1);
  }

  ngOnInit() {
    console.log(this.twitchChatLink);
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  ngOnChanges() {
    this.isConnected = localStorage.getItem('isConnected');
  }

  isCsonnected(): boolean {
    if (localStorage.getItem('isConnected') == 'true') {
      return true;
    } else {
      return false;
    }
  }

  timeoutUser() {
    this.userService.timeoutUser(this.timeoutUserForm.value);
    console.log("timeout");
  }

  sendMessageOnChat() {
    this.userService.sendMessageOnChat(this.sendMessageForm.value);
    console.log("msg");
  }

  connectToChannel() {
    this.userService.connectToChannel();
    console.log("connect");
  }

  disconnectFromChannel() {
    this.userService.disconnectFromChannel();
    console.log("discoonect");
  }

  logout() {
    this.authService.doLogout();
  }

  startGiveaway() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      if (this.isGiveawayStarted == false) {
        this.userService.startGiveaway();
        this.successMessage = `Giveaway is starting...`;
        this._success.next(this.successMessage);
        this.isGiveawayStarted = true;
      } else {
        this.successMessage = `Giveaway is started`;
        this._success.next(this.successMessage);
      }
    } else {
      this.successMessage = `You have to be connected to channel!`;
      this._success.next(this.successMessage);
    }
  }

  drawTheWinner() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      if (this.isGiveawayStarted == true) {
        this.userService.drawTheWinner();
        this.successMessage = `Winner is on chat!`;
        this._success.next(this.successMessage);
        this.isGiveawayStarted = false;
      } else {
        this.successMessage = `Giveaway is not started`;
        this._success.next(this.successMessage);
      }
    } else {
      this.successMessage = `You have to be connected to channel!`;
      this._success.next(this.successMessage);
    }
  }

  addPhrase() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      this.userService.addPhraseToBlock(this.phraseAddForm.value);
      this.successMessage = `Added the phrase!`;
      this._success.next(this.successMessage);
    } else {
      this.successMessage = `You have to be connected to channel!`;
      this._success.next(this.successMessage);
    }
  }

  removePhrase() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      this.userService.removePhrase(this.removePhraseForm.value);
      this.successMessage = `Removed the phrase!`;
      this._success.next(this.successMessage);
    } else {
      this.successMessage = `You have to be connected to channel!`;
      this._success.next(this.successMessage);
    }
  }
}
