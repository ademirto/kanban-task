import {Component, OnInit} from '@angular/core';
import {ProfileService} from './profile.service';

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

class Login {
  email: string
  password: string
}


@Component({
  selector: 'user-login-form',
  templateUrl: 'ui/user.component/login-form.html'
})
export class UserLoginFormComponent implements OnInit {
  login: Login

  constructor(private profile: ProfileService) {}

  ngOnInit() {
    this.login = new Login();
  }

  save() {
    this.profile.signIn(this.login.email, this.login.password).subscribe(
      (res) => {
        console.log('ok');
      },
      (err) => {
        console.log('err');
      }
    )
  }
}
