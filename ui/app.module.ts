import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {ProfileService} from './profile.service';
import {ProfileComponent,
        UserRegisterComponent,
        UserLoginFormComponent} from './user.component';
import {HomeComponent} from './home.component';
import {routing, appRouterProviders} from './app.routes';

import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    appRouterProviders,
    ProfileService
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    UserRegisterComponent,
    UserLoginFormComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
