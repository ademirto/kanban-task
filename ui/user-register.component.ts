import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {User} from './user.component';
import {ProfileService} from './profile.service';
import {Router} from '@angular/router';

@Component({
  selector: 'user-register',
  templateUrl: 'ui/user-register.component.html'
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
