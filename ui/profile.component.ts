import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProfileService, SessionInformation} from './profile.service';

@Component({
  selector: 'profile',
  templateUrl: 'ui/profile.component.html'
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
