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

@Injectable()
export class ServiceService {
  private apiUrl = `${environment.apiUrl}service/`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getDetail(idService) {
    const url = `${this.apiUrl}${idService}/detail`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.token}`
      })
    };
    return this.http.get(url, httpOptions)
      .pipe(
        tap((res: Paginated) => res),
        catchError((err: any) => Observable.throw({ status: err.status, ...err.error }))
      );
  }

  getRelated(idService) {
    const url = `${this.apiUrl}${idService}/related`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.token}`
      })
    };
    return this.http.get(url, httpOptions)
      .pipe(
        tap((res: Paginated) => res),
        catchError((err: any) => Observable.throw({ status: err.status, ...err.error }))
      );
  }

  getReviews(idService) {
    const url = `${this.apiUrl}${idService}/reviews`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.token}`
      })
    };
    return this.http.get(url, httpOptions)
      .pipe(
        tap((res: Paginated) => res),
        catchError((err: any) => Observable.throw({ status: err.status, ...err.error }))
      );
  }

}
