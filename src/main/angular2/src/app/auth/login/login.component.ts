import { Component, OnInit } from '@angular/core';
import { Login } from './login.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CognitoCallback, UserLoginService, LoggedInCallback } from '../../service/cognito.service';

console.log('HERE');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {
  username: string;
  password: string;
  errorMessage: string;
  submitted = false;
  model = new Login('', '');

  constructor(public router: Router, public userService: UserLoginService) {
    console.log('Constructor called...');
  }

  ngOnInit() {
    this.errorMessage = null;
    console.log('Checking if the user is already authenticated. If so, then redirect to the secure site');
    this.userService.isAuthenticated(this);
  }

  onSubmit() {
    console.log('onSubmit called...');
    this.submitted = true;
    console.log('Username >>> ' + this.model.username);
    console.log('Password >>> ' + this.model.password);

    // Call Authentication Service
    this.userService.authenticate(this.model.username, this.model.password, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) {
      this.errorMessage = message;
      console.log('result: ' + this.errorMessage);
      if (this.errorMessage === 'User is not confirmed.') {
          console.log('redirecting');
          // this.router.navigate(['/home/confirmRegistration', this.email]);
      }
    } else {
      // this.ddb.writeLogEntry("login");
      // this.router.navigate(['/securehome']);
      console.log('User has logged in successfully! ' + result.getIdToken().getJwtToken());
      this.router.navigate(['/employees']);
    }
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
      if (isLoggedIn) {
          // this.router.navigate(['/securehome']);
          console.log('User is authenticated!');
      }
  }

}

