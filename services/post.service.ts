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
import { environment } from './../../environments/environment';

import { Post } from './../interfaces/post';

@Injectable()
export class PostService {
  private apiUrl = `${environment.apiUrl}post/`;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  createPost(data: Post) {
    const url = this.apiUrl
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.token}`
      })
    };
    return this.http.post(url, data, httpOptions)
      .subscribe(
        (res: Post) => res,
        (err: HttpErrorResponse) => { return {}; }
      );
  }

}
