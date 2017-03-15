import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { UserLoginService, UserParametersService, CognitoUtil} from './service/cognito.service';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeService } from './service/employee.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmployeesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    AppRoutingModule
  ],
  providers: [
    UserLoginService,
    UserParametersService,
    CognitoUtil,
    EmployeeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
