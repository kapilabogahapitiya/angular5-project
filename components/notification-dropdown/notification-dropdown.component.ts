import { Component, OnInit } from '@angular/core';

import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.css']
})
export class NotificationDropdownComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public userService: UserService
  ) { }

  ngOnInit() {
  }

}
