import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ProfileComponent} from './profile.component';
import {ProfileService} from './profile.service';

import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    ProfileService
  ],
  declarations: [
    AppComponent,
    ProfileComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
