import { Component, OnInit } from '@angular/core';
import { Employee } from './new-employee.model';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit {
  errorMessage: string;
  model = new Employee();
  submitted = false;

  constructor() { }

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
  }

}
