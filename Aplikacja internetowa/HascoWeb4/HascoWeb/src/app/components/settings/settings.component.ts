import { Component, OnInit } from '@angular/core';
import { UserService } from './../../shared/user.service';
import { AuthService } from './../../shared/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  currentUser: string;
  isConnected: string;
  subscribersMod = 'false';
  emoteOnlyMod = 'false';
  followersMod = 'false';
  isToggle = false;
  customCommandsForm: FormGroup;
  giveawayForm: FormGroup;
  spamFilterForm: FormGroup;
  followersModForm: FormGroup;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string = ``;

  public now: Date = new Date();


  constructor(
    public userService: UserService,
    public authService: AuthService,
    public fb: FormBuilder
  ) {
    this.customCommandsForm = this.fb.group({
      commandName: [''],
      response: ['']
    })
    this.giveawayForm = this.fb.group({
      giveawayKeyword: ['']
    })
    this.spamFilterForm = this.fb.group({
      Phrase: ['']
    })
    this.followersModForm = this.fb.group({
      Value: ['']
    })

    setInterval(() => {
      this.now = new Date();
    }, 1);

  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('channel-name');
    this.isConnected = localStorage.getItem('isConnected');
    this.subscribersMod = localStorage.getItem('subscribers-mod');
    this.emoteOnlyMod = localStorage.getItem('emoteonly-mod');
    this.followersMod = localStorage.getItem('followers-mod');
    console.log(this.currentUser);
    console.log(this.isConnected);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }


  disconnectFromChannel() {
    this.userService.disconnectFromChannel();
    console.log("discoonect");
  }

  connectToChannel() {
    this.userService.connectToChannel();
    console.log("connect");
  }

  isCsonnected(): boolean {
    if (localStorage.getItem('isConnected') == 'true') {
      return true;
    } else {
      return false;
    }
  }


  setSubscribersModOn() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      this.subscribersMod = localStorage.getItem('subscribers-mod');
      if (this.subscribersMod == 'false' || this.subscribersMod == null) {
        this.userService.setSubscribersModOn();
        this.successMessage = `Subscribers mod is starting...`;
        localStorage.setItem('subscribers-mod', 'true');
        this._success.next(this.successMessage);
      } else {
        this.successMessage = `Subscribers mod is running`;
        this._success.next(this.successMessage);
      }
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }

  setSubscribersModOff() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      this.subscribersMod = localStorage.getItem('subscribers-mod');
      if (this.subscribersMod == 'true' || this.subscribersMod == null) {
        this.userService.setSubscribersModOff();
        this.successMessage = `Subscribers mod is being stopped...`;
        localStorage.setItem('subscribers-mod', 'false');
        this._success.next(this.successMessage);
      } else {
        this.successMessage = `Subscribers mod is stopped`;
        this._success.next(this.successMessage);
      }
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }

  setEmoteOnlyModOn() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      this.emoteOnlyMod = localStorage.getItem('emoteonly-mod');
      if (this.emoteOnlyMod == 'false' || this.emoteOnlyMod == null) {
        this.userService.setEmoteOnlyOn();
        this.successMessage = `Emote only mod is starting...`;
        localStorage.setItem('emoteonly-mod', 'true');
        this._success.next(this.successMessage);
      } else {
        this.successMessage = `Emote only mod is running`;
        this._success.next(this.successMessage);
      }
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }

  setEmoteOnlyModOff() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      this.emoteOnlyMod = localStorage.getItem('emoteonly-mod');
      if (this.emoteOnlyMod == 'true' || this.emoteOnlyMod == null) {
        this.userService.setEmoteOnlyOff();
        this.successMessage = `Emote onnly mod is being stopped...`;
        localStorage.setItem('emoteonly-mod', 'false');
        this._success.next(this.successMessage);
      } else {
        this.successMessage = `Emote only mod is stopped`;
        this._success.next(this.successMessage);
      }
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }

  setFollowersOn() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      this.followersMod = localStorage.getItem('followers-mod');
      if (this.followersMod == 'false' || this.followersMod == null) {
        this.userService.setFollowersModOn(this.followersModForm.value);
        this.successMessage = `Followers mod is starting...`;
        localStorage.setItem('followers-mod', 'true');
        this._success.next(this.successMessage);
      } else {
        this.successMessage = `Followers mod is stopped`;
        this._success.next(this.successMessage);
      }
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }

  setFollowersOff() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      this.followersMod = localStorage.getItem('followers-mod');
      if (this.followersMod == 'true' || this.followersMod == null) {
        this.userService.setFollowersModOff();
        this.successMessage = `Followers mod is being stopped...`;
        localStorage.setItem('followers-mod', 'false');
        this._success.next(this.successMessage);
      } else {
        this.successMessage = `Followers mod is stopped`;
        this._success.next(this.successMessage);
      }
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }

  logout() {
    this.authService.doLogout();
  }

  clearChat() {
    this.isConnected = localStorage.getItem('isConnected');
    if (this.isConnected == 'true') {
      this.userService.clearChat();
      this.successMessage = `Chat is cleared`;
      this._success.next(this.successMessage);
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }
}
