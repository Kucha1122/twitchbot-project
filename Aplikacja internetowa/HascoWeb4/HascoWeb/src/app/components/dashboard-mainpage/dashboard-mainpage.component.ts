import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-mainpage',
  templateUrl: './dashboard-mainpage.component.html',
  styleUrls: ['./dashboard-mainpage.component.css']
})
export class DashboardMainpageComponent implements OnInit {
  timeoutUserForm: FormGroup;
  sendMessageForm: FormGroup;
  customCommandsForm: FormGroup;
  timeoutForm: FormGroup;
  slowModForm: FormGroup;
  giveawayForm: FormGroup;
  spamFilterForm: FormGroup;
  isConnectedProp: string;
  slowMod: string;
  timedoutUsers: number;
  messages: number;
  commandsTriggered: number;
  private _success = new Subject<string>();
  public now: Date = new Date();


  staticAlertClosed = false;
  successMessage: string = ``;

  currentUser = localStorage.getItem('channel-name');
  twitchChatLink = `https://www.twitch.tv/embed/kubon_/chat`; // ${this.currentUser}
  liveStreamLink = `https://player.twitch.tv/?channel=kubon_&muted=true`; // ${this.currentUser}
  urlSafe: SafeResourceUrl;
  isConnectedStorage = localStorage.getItem('isConnected');

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
    this.spamFilterForm = this.fb.group({
      Phrase: ['']
    })
    this.slowModForm = this.fb.group({
      Value: ['']
    })
    this.timeoutForm = this.fb.group({
      UserName: [''],
      Seconds: ['']
    })

    setInterval(() => {
      this.now = new Date();
    }, 1);
  }

  ngOnInit() {
    console.log(this.twitchChatLink);
    console.log(this.isConnectedStorage);
    this.messages = parseInt(localStorage.getItem('messages'));
    this.commandsTriggered = parseInt(localStorage.getItem('commandsTriggered'));
    this.timedoutUsers = parseInt(localStorage.getItem('timedoutUsers'));
    this.slowMod = localStorage.getItem('slow-mod');
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  ngOnChanges() {
    this.messages = parseInt(localStorage.getItem('messages'));
    this.commandsTriggered = parseInt(localStorage.getItem('commandsTriggered'));
    this.timedoutUsers = parseInt(localStorage.getItem('timedoutUsers'));
  }



  isConnected(): boolean {
    if (localStorage.getItem('isConnected') == 'true') {
      return true;
    } else {
      return false;
    }
  }

  sendMessageOnChat() {
    if (this.isConnectedStorage == 'true') {
      this.userService.sendMessageOnChat(this.sendMessageForm.value);
      this.addCommandsTriggeredToCounter();
      this.addMessageToCounter();
      this.successMessage = `Message sent!`;
      this._success.next(this.successMessage);
    } else {
      this.successMessage = `You have to be connected to channel!`;
      this._success.next(this.successMessage);
    }
    console.log("msg");
  }

  connectToChannel() {
    this.userService.connectToChannel();
    console.log("connect");
    this.isConnectedProp == 'true';
  }

  disconnectFromChannel() {
    this.userService.disconnectFromChannel();
    console.log("discoonect");
  }


  setSlowModOn() {
    this.isConnectedProp = localStorage.getItem('isConnected');
    if (this.isConnectedProp == 'true') {
      this.slowMod = localStorage.getItem('slow-mod');
      if (this.slowMod == 'false' || this.slowMod == null) {
        this.userService.setSlowModOn(this.slowModForm.value);
        this.addCommandsTriggeredToCounter();
        this.successMessage = `Slow mod is starting...`;
        localStorage.setItem('slow-mod', 'true');
        this._success.next(this.successMessage);
      } else {
        this.successMessage = `Slow mod is running`;
        this._success.next(this.successMessage);
      }
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }

  setSlowModOff() {
    this.isConnectedProp = localStorage.getItem('isConnected');
    if (this.isConnectedProp == 'true') {
      this.slowMod = localStorage.getItem('slow-mod');
      if (this.slowMod == 'true' || this.slowMod == null) {
        this.userService.setSlowModOff();
        this.addCommandsTriggeredToCounter();
        this.successMessage = `Slow mod is being stopped...`;
        localStorage.setItem('slow-mod', 'false');
        this._success.next(this.successMessage);
      } else {
        this.successMessage = `Slow mod is stopped`;
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
    this.isConnectedProp = localStorage.getItem('isConnected');
    if (this.isConnectedProp == 'true') {
      this.userService.clearChat();
      this.addCommandsTriggeredToCounter();
      this.successMessage = `Chat is cleared`;
      this._success.next(this.successMessage);
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }

  timeout() {
    this.isConnectedProp = localStorage.getItem('isConnected');
    if (this.isConnectedProp == 'true') {
      this.userService.timeoutUser(this.timeoutForm.value);
      this.addTimeoutsToCounter();
      this.commandsTriggered++;
      this.successMessage = `User is timed out`;
      this._success.next(this.successMessage);
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }

  addMessageToCounter() {
    this.messages = parseInt(localStorage.getItem('messages'));
    this.messages++;
    var test: string = String(this.messages);
    localStorage.setItem('messages', test);
  }

  addCommandsTriggeredToCounter() {
    this.commandsTriggered = parseInt(localStorage.getItem('commandsTriggered'));
    this.commandsTriggered++;
    var test: string = String(this.commandsTriggered);
    localStorage.setItem('commandsTriggered', test);
  }
  addTimeoutsToCounter() {
    this.timedoutUsers = parseInt(localStorage.getItem('timedoutUsers'));
    this.timedoutUsers++;
    var test: string = String(this.timedoutUsers);
    localStorage.setItem('timedoutUsers', test);
  }

  resetStats() {
    if (this.isConnectedStorage == 'true') {
      localStorage.setItem('messages', '0');
      localStorage.setItem('timedoutUsers', '0');
      localStorage.setItem('commandsTriggered', '0');
      this.successMessage = `Stats are cleared`;
      this._success.next(this.successMessage);
      this.router.navigate(['dashboard']);
    } else {
      this.successMessage = `You have to be connected!`;
      this._success.next(this.successMessage);
    }
  }

}
