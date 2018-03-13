import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

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

import { AuthService } from './auth.service';
import { Paginated } from './../interfaces/paginated';
import { environment } from './../../environments/environment';
import { User } from './../interfaces/user';

@Injectable()
export class UserService {
  private apiUrl = `${environment.apiUrl}user/`;

  public followers: Paginated;
  public user: User;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get(userId: string = '') {
    const url = `${this.apiUrl}`;
    let httpOptions: { headers: any, params?: any } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.token}`
      })
    };
    
    if (userId) httpOptions = { ...httpOptions, params: { userId } };

    return this.http.get(url, httpOptions)
      .pipe(
        tap((res: { user: User }) => {
          if (!userId) this.user = res.user;
          return res.user;
        })
      );
  }

  update(user: User) {
    const url = `${this.apiUrl}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.token}`
      })
    };
    return this.http.put(url, user, httpOptions)
      .pipe(
        tap((res: { success?: string }) => {
          this.user = { ...this.user, ...user };
          return res;
        })
      );
  }

  getFollowers(lt_id = '') {
    const url = `${this.apiUrl}followers`;
    let httpOptions: { headers: any, params?: any } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.token}`
      })
    };

    if (lt_id) httpOptions = { ...httpOptions, params: { lt_id } };

    return this.http.get(url, httpOptions)
      .pipe(
        tap((res: Paginated) => res),
        catchError((err: any) => Observable.throw({ status: err.status, ...err.error }))
      );
  }


  getFollowing(lt_id = '') {
    const url = `${this.apiUrl}following`;
    let httpOptions: { headers: any, params?: any } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.token}`
      })
    };

    if (lt_id) httpOptions = { ...httpOptions, params: { lt_id } };

    return this.http.get(url, httpOptions)
      .map((res) => res || {})
      .catch((error): Observable<any> => Observable.throw(error || 'Server error'));
  }
}
