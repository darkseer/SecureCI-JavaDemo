import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { EmployeesComponent } from './employees/employees.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';

const routes: Routes = [
   { path: '', redirectTo: '/login', pathMatch: 'full' },
   { path: 'login', component: LoginComponent },
   { path: 'employees', component: EmployeesComponent },
   { path: 'new-employee', component: NewEmployeeComponent },
   { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {

}
