import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserLoginService } from './service/cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isCollapsed = true;
  title = 'TICS II CI/CD Technical Demonstration';
  environtName = environment.envName;

  constructor(public userLoginService: UserLoginService) {}

  logout() {
    this.userLoginService.logout();
  }
}
