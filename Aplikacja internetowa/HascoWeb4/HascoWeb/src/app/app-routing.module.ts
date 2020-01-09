import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';

import { AuthGuard } from './shared/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainpageComponent } from './components/mainpage/mainpage.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DashboardMainpageComponent } from './components/dashboard-mainpage/dashboard-mainpage.component'


const routes: Routes = [
  { path: '', redirectTo: 'mainpage', pathMatch: 'full' },
  { path: 'log-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'mainpage', component: MainpageComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardMainpageComponent },
      { path: 'mainpage', component: DashboardMainpageComponent },
      { path: '', redirectTo: 'dashboard-mainpage', pathMatch: 'full' },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] }
    ]
  }

  //{ path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }