import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Employee } from '../employees/employee.model';
import { environment } from '../../environments/environment';
import { HttpBaseService } from './http-base.service';

@Injectable()
export class EmployeeService extends HttpBaseService {

  constructor(private http: Http) {
    super();
  }

  getEmployees(authToken): Observable<Employee[]> {
    const options = this.getHeaderOptions(authToken);
    return this.http.get(this.employeeLambdaURL, options).map(this.extractData);
  }

  addEmployee(authToken, Employee): Observable<Response> {
    const options = this.getHeaderOptions(authToken);

    const command = {};
    command['operation'] = 'create';
    const Item = {};
    Item['Item'] = Employee;
    command['payload'] = Item;

    const postBody = JSON.stringify(command);

    console.log('Command Structure >>> ' + postBody);

    return this.http.post(this.employeeLambdaURL, postBody, options);
  }

  deleteEmployee(authToken, Employee): Observable<Response> {
    const options = this.getHeaderOptions(authToken);
    const command = {};
    command['operation'] = 'delete';
    const Item = {};
    Item['Key'] = { 'username' : Employee.username };
    command['payload'] = Item;

    const postBody = JSON.stringify(command);

    console.log('Command Structure >>> ' + postBody);

    return this.http.post(this.employeeLambdaURL, postBody, options);
  }
}

/**
 {
    "operation": "create",
    "payload": {
    	"Item": { 
    		"username": "jcaple007",
    		"firstname": "James",
    		"lastname": "Bond",
    		"address1": "44 Knoll Drive",
    		"address2": "n/a",
    		"city": "Falls Church",
    		"state": "Virginia",
    		"zip": "22042",
    		"email": "test@gmail.com",
    		"phone": "555555555" 
    	}
    }
}

{
    "operation": "delete",
    "payload": {
    	"Key": { "username": "jcaple007" }
    }
}
 */
