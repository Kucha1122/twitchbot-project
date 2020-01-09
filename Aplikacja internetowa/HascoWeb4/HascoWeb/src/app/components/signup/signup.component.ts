import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      channelName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  /*
  registerUser() {
    this.authService.signUp(this.signupForm.value).subscribe((res) => {
      //if (res.result) {
      this.signupForm.reset()
      this.router.navigate(['log-in']);
      //}
    })
  }
  */

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.signUp(this.signupForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['log-in']);
        },
        error => {
          console.log(error);
          this.loading = false;
        }
      )
  }

}
