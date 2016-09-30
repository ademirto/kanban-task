import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {User} from './user.component';
import {ProfileService} from './profile.service';

@Component({
  selector: 'user-register',
  templateUrl: 'ui/user-register.component.html'
})
export class UserRegisterComponent implements OnInit {
  @Input() user: User

  constructor(private profile: ProfileService) {}

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
        console.log(data);
      }
    );
  }
}
