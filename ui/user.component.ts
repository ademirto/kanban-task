import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ProfileService, SessionInformation} from './profile.service';
import {Router} from '@angular/router';

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
  selector: 'profile',
  templateUrl: 'ui/user.component/profile.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
  sub: any;
  session: SessionInformation;

  constructor(private profile: ProfileService) {}

  ngOnInit() {
    this.sub = this.profile.session().subscribe(
      (res) => {
        let rst = res.json();
        this.session = new SessionInformation(
          rst.fullName,
          rst.username,
          rst.isAuthenticated
        );
      },
      () => {
        this.session = new SessionInformation('', '', false);
      }
    )
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

@Component({
  selector: 'user-register',
  templateUrl: 'ui/user.component/register-form.html'
})
export class UserRegisterComponent implements OnInit {
  @Input() user: User

  constructor(private router: Router, private profile: ProfileService) {}

  ngOnInit() {
    this.user = new User();
  }

  goBack() {
    console.log('go back');
  }

  save() {
    this.profile.register(this.user).subscribe(
      (res) => {
        let data = res.json();
        let message;

        if(data.success) {
          message = 'Usuário registrado com sucesso, verifique o seu email para fazer ativação.'
          this.router.navigate(['/home']);
        }
        else
          message = data.message.errmsg;

        new Android_Toast({
          content: message,
          duration: 2500,
          position: 'bottom'
        });
      }
    );
  }
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
