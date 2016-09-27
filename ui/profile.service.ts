import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

export class SessionInformation {
  constructor(
    public fullName: string,
    public username: string,
    public isAuthenticated: boolean,
  ) {}
}

@Injectable()
export class ProfileService {
  constructor(private http: Http) {}

  session(): Observable<Response> {
    return this.http.get('/api/users/session');
  }
}
