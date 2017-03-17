import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInCallback, UserLoginService, CognitoUtil, Callback } from '../service/cognito.service';
import { Http, Response } from '@angular/http';
import { EmployeeService } from '../service/employee.service';
import { Employee } from './employee.model';
import { AuthBaseComponent } from '../auth-base.module';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent extends AuthBaseComponent implements OnInit, LoggedInCallback {

  errorMessage: string;
  employees: Employee[];
  mode = 'Observable';

  constructor(public router: Router, public userService: UserLoginService, public cognitoUtil: CognitoUtil,
    private employeeService: EmployeeService) {
    super(router, userService, cognitoUtil);
    console.log('In EmployeesComponent');
  }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    console.log('Getting employees');
    const authToken = localStorage.getItem('auth_token');
    this.employeeService.getEmployees(authToken).subscribe(
      employees => this.employees = employees,
      error => this.handleGetEmployeesErrors(<any>error)
    );
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

  addNewUser() {
    this.router.navigate(['/new-employee']);
  }

  deleteUser(Employee) {
    console.log('Deleteing User ' + JSON.stringify(Employee));
    const authToken = localStorage.getItem('auth_token');
    this.employeeService.deleteEmployee(authToken, Employee).subscribe(
      res => this.deleteUserSuccess(Employee, <any>res),
      error => this.handleGetEmployeesErrors(<any>error)
    );
  }

  deleteUserSuccess(employee: Employee, res) {
    console.log('Succeeded in deleting ' + JSON.stringify(employee));
    console.log('Response from server ' + JSON.stringify(res));
    this.getEmployees();
  }

}
