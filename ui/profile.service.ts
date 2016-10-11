import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {RegisterModel} from './user.service';
import {Observable} from 'rxjs';

export class SessionInformation {
  constructor(
    public fullName: string,
    public username: string,
    public isAuthenticated: boolean
  ) {}
}

@Injectable()
export class ProfileService {
  private mySession: SessionInformation

  constructor(private http: Http) {
    this.mySession = null;
  }

  initSession() {
    this.http.get('/api/users/session').subscribe(
      (res) => {
        let rst = res.json();
        this.mySession = new SessionInformation(
          rst.fullName,
          rst.username,
          rst.isAuthenticated
        );
      },
      () => {
        this.mySession = null;
      }
    );
  }

  get session() {
    return this.mySession;
  }

  register(user: RegisterModel): Observable<Response> {
    if(!user.username)
      user.username = user.usernameFromEmail();

    return this.http.post('/api/users/register', user);
  }

  signOut(): Observable<Response> {
    return this.http.post('/api/users/signOut', {});
  }

  signIn(email: string, password: string): Observable<Response> {
    return this.http.post('/api/users/signIn', {
      email: email,
      password: password
    });
  }
}
