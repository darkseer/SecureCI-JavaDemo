import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Employee } from '../employees/employee.model';
import { environment } from '../../environments/environment';

@Injectable()
export class EmployeeService {

  private employeeLambdaURL = environment.lambdaurl;

  constructor(private http: Http) {}

  getEmployees(authToken): Observable<Employee[]> {
    console.log('getEmployees authToken in localStorage: ' + authToken);
    const header = new Headers({ 'Authorization': authToken });
    const options = new RequestOptions({ headers: header });
    return this.http.get(this.employeeLambdaURL, options).map(this.extractData).catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = JSON.parse( res.json() );
    console.log('Received JSON from Server >>> ' + body);
    return body || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error('Received HTTP Error ---> ' + errMsg);
    return Observable.throw(errMsg);
  }
}
