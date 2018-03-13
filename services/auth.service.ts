import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import {
  Observable
} from 'rxjs/Observable';
import {
  of
} from 'rxjs/observable/of';
import {
  catchError,
  map,
  tap
} from 'rxjs/operators';
import {
  FacebookService,
  InitParams,
  LoginResponse as FBLoginResponse
} from 'ngx-facebook';

import { environment } from './../../environments/environment';

import { User } from './../interfaces/user';
import { UserService } from './../services/user.service';

@Injectable()
export class AuthService {
  public id    : string;
  public token : string;
  public isLoggedIn: boolean;
  public fbData: FBLoginResponse;
  private userService: UserService;

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private fb: FacebookService
  ) {
    this.token = localStorage.getItem('token');

    if (this.token) this.isLoggedIn = true;
    else this.isLoggedIn = false;

    let initParams: InitParams = {
      appId: environment.FACEBOOK_APP_ID,
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams);
  }

  signin(email: string, password: string) {
    const url = `${this.apiUrl}user/login`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(url, { email, password }, httpOptions)
      .pipe(
        tap((res: { completedRegistration: boolean, token: string }) => {
          const { completedRegistration, token } = res;
          this.token = token;

          if (completedRegistration) {
            this.isLoggedIn = true;
            localStorage.setItem('token', token);
          } else {
            this.isLoggedIn = false;
            localStorage.setItem('token', '');
          }

          return token;
        })
      );
  }

  signinWithFB(token) {

    const url = `${this.apiUrl}user/facebook/token`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(url, { token }, httpOptions)
      .pipe(
        tap((res: { token: string }) => {
          const { token } = res;

          this.token = token;
          this.isLoggedIn = true;

          localStorage.setItem('token', token);

          return token;
        })
      );
  }

  signupWithFB(token) {
    const url = `${this.apiUrl}user/facebook/token`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(url, { token }, httpOptions)
      .pipe(
        tap((res: { id: string, token: string }) => {
          const { id, token } = res;
          this.id    = id;
          this.token = token;
          this.isLoggedIn = true;
          localStorage.setItem('token', token);
          
          return token;
        })
      );
  }

  signout() {
    const url = `${this.apiUrl}user/logout`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    };

    this.token = '';
    this.isLoggedIn = false;

    localStorage.setItem('token', '');

    return this.http.post(url, null, httpOptions)
      .pipe(
        tap((res) => {
          return res;
        }),
        catchError((err: any) => { throw { status: err.status, ...err.error }; })
      );
  }



  signupWithEMail(email: string, password: string) {
    const url = `${this.apiUrl}user/signup`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(url, { email, password }, httpOptions)
      .pipe(
        tap((res: { id: string, token: string }) => {
          const { id, token } = res;
          this.id    = id;
          this.token = token;
          this.isLoggedIn = true;
          localStorage.setItem('token', token);

          return token;
        })
      );
  }

  forgotPassword(email: string): void {
    const url = `${this.apiUrl}user/otp`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const req = this.http.post(url, {email}, httpOptions).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
      }
    );
   
  }

  signupWithGoogle(): void {
    console.log('signup with google');
  }

  googleSignin(successHandler): any {
  }

  fbSignin(successHandler): void {
    this.fb.login()
      .then((response: FBLoginResponse) => successHandler(response))
      .catch((err: any) => console.error(err));
  }
}
