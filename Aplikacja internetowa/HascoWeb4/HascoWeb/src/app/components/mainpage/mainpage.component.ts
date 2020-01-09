import { Component, OnInit, ɵCompiler_compileModuleAndAllComponentsAsync__POST_R3__, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  signinForm: FormGroup;
  signupForm: FormGroup;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.signinForm = this.fb.group({
      channelName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
    this.signupForm = this.fb.group({
      channelName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get f() { return this.signupForm.controls; }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }


  }

  ngOnInit() {
  }

  loginUser() {
    this.authService.signIn(this.signinForm.value);
    this.closeModalEvent.emit(false);
  }

  registerUser() {
    this.authService.signUp(this.signupForm.value).subscribe((res) => {
      //if (res.result) {
      this.signupForm.reset()
      this.router.navigate(['mainpage']);
      //}
    })
  }



}
