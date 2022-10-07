import { AuthService } from './../../shared/auth/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(private authService: AuthService) {
    this.authService.logout()
  }
}
