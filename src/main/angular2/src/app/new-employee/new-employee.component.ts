import { Component, OnInit } from '@angular/core';
import { Employee } from '../employees/employee.model';
import { Http, Response } from '@angular/http';
import { EmployeeService } from '../service/employee.service';
import { Router } from '@angular/router';
import { LoggedInCallback, UserLoginService, CognitoUtil, Callback } from '../service/cognito.service';
import { AuthBaseComponent } from '../auth-base.module';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent extends AuthBaseComponent implements OnInit {
  errorMessage: string;
  model = new Employee();
  submitted = false;

  constructor(public router: Router, public userService: UserLoginService, private employeeService: EmployeeService,
     public cognitoUtil: CognitoUtil) {
    super(router, userService, cognitoUtil);
  }

  ngOnInit() {
    this.errorMessage = null;
  }

  onSubmit() {
    console.log('onSubmit called...');
    this.submitted = true;
    console.log('Username >>> ' + this.model.username);
    console.log('Password1 >>> ' + this.model.password1);
    console.log('Password2 >>> ' + this.model.password2);
    console.log(JSON.stringify(this.model));

    const authToken = localStorage.getItem('auth_token');
    this.employeeService.addEmployee(authToken, this.model).subscribe(
      res => this.handleSuccess(<any>res),
      error => this.handleGetEmployeesErrors(<any>error)
    );
  }

  handleSuccess(resp) {
    console.log('Successful Response >>> ' + JSON.stringify(resp));
    this.router.navigate(['/employees']);
  }

  handleGetEmployeesErrors(error) {
    const errMsg = 'An unexpected error occurred';
    if (error instanceof Response) {
      const rcode = error.status;
      const msgBody = error.statusText;

      console.log('Response Code >>> ' + rcode);
      console.log('Msg Body >>> ' + msgBody);

      super.handleUnauthorizedAccess(rcode);

    } else {
      this.errorMessage = errMsg;
    }
  }

}
