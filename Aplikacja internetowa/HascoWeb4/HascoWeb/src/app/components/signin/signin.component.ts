import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.signinForm = this.fb.group({
      channelName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  /*
    loginUser() {
      this.authService.signIn(this.signinForm.value);
    }
    */

  onSubmit() {
    this.authService.signIn(this.signinForm.value);
  }

}
