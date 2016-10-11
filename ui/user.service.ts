import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';

export class User {
  constructor(
    public username?: string,
    public firstname?: string,
    public lastname?: string,
    public email?: string,
    public password?: string,
    public confirmPassword?: string
  ) {}

  usernameFromEmail() {
    return this.email.split('@')[0];
  }
}

@Injectable()
export class UserService {
  private db: User[];

  constructor(private http: Http) {}

  read() {
    this.db = [];
    
    this.http.get('/api/users').subscribe(
      (res) => {
        var rst = res.json();

        if(rst.success)
          this.db = rst.collection;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  get collection(): User[] {
    return this.db;
  }
}
