import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInCallback, UserLoginService, CognitoUtil, Callback } from '../service/cognito.service';
import { EmployeeService } from '../service/employee.service';
import { Employee } from './employee.model';

export class AuthTokens {
    public accessToken: string;
    public idToken: string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, LoggedInCallback {

  public authTokens: AuthTokens = new AuthTokens();
  errorMessage: string;
  employees: Employee[];
  mode = 'Observable';

  constructor(public router: Router, public userService: UserLoginService, public cognitoUtil: CognitoUtil,
    private employeeService: EmployeeService) {
    this.userService.isAuthenticated(this);
    console.log('In EmployeesComponent');
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      console.log('no logged in, redirecting');
      this.router.navigate(['/login']);
    } else {
      console.log('Getting user tokens');
      this.cognitoUtil.getAccessToken(new AccessTokenCallback(this));
      this.cognitoUtil.getIdToken(new IdTokenCallback(this));
    }
  }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    console.log('Getting employees');
    const authToken = localStorage.getItem('auth_token');
    this.employeeService.getEmployees(authToken).subscribe(employees => this.employees = employees,
        error => this.errorMessage = <any>error);
  }

  callbackWithParam(jwtToken: string) {
    console.log('User Has Valid Token >>> ' + jwtToken);
  }

}

export class AccessTokenCallback implements Callback {
    constructor(public jwt: EmployeesComponent) {

    }

    callback() {

    }

    callbackWithParam(result) {
        this.jwt.authTokens.accessToken = result;
    }
}

export class IdTokenCallback implements Callback {
    constructor(public jwt: EmployeesComponent) {

    }

    callback() {

    }

    callbackWithParam(result) {
      console.log('ID Token >>> ' + result);
      this.jwt.authTokens.idToken = result;
    }
}
