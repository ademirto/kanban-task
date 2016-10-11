import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';

export class RegisterModel {
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

export class CompositeName {
  constructor(public firstName?: string, public lastName?: string) {}

  get fullname() {
    if(this.firstName && this.lastName)
      return [this.firstName, this.lastName].join(' ');
    else if(this.firstName)
      return this.firstName;
    else if(this.lastName)
      return this.lastName;
    else
      return '';
  }
}

export class User {
  constructor(public id?: string,
              public username?: string,
              public email?: string,
              public password?: string,
              public name?: CompositeName,
              public active?: boolean,
              public activateToken?: string) {
      if(!this.name)
        this.name = new CompositeName();
    }

    get fullname() {
      return this.name.fullname;
    }
}

@Injectable()
export class UserService {
  selected: User;
  private db: User[];

  constructor(private http: Http) {
    this.selected = new User();
  }

  select(id: string) {
    this.http.get(['/api/users', id].join('/')).subscribe(
      (res) => {
        let rst = res.json();
        this.selected = rst.instance;
      },
      (err) => {
        this.selected = new User();
      }
    )
  }

  create(user: User): Observable<Response> {
    if(!user.username && user.email)
      user.username = user.email.split('@')[0];

    return this.http.post('/api/users', user);
  }

  update(user: User): Observable<Response> {
    return this.http.put(['/api/users', user.id].join('/'), user);
  }

  save(user?: User): Observable<Response> {
    if(this.selected.id)
      return this.update((user || this.selected));
    else
      return this.create((user || this.selected));
  }

  read() {
    this.db = [];

    return this.http.get('/api/users').subscribe(
      (res) => {
        var rst = res.json();

        if(rst.success)
          this.db = rst.collection.map(
            (data) => {
              return new User(
                data.id,
                data.username,
                data.email,
                null,
                new CompositeName(
                  data.name.firstName,
                  data.name.lastName
                ),
                data.active,
                data.activateToken
              );
            }
          );
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
