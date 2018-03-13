import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.css']
})
export class MenuDropdownComponent implements OnInit {
  @Output() successHandler = new EventEmitter<boolean>();

  constructor(
  	private authService: AuthService,
    public userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    
  }

  onClickLogout(): void {
    this.successHandler.emit(true);
  	this.authService.signout()
      .subscribe(
        (res) => {
          console.log('logout success');
        },
        (err) => {
          console.log(err);
        }
      );
    this.router.navigate(["/home"]);
  }

}
