import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {UserRegisterComponent, UserLoginFormComponent, UserListComponent} from './user.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: 'user/register', pathMatch: 'full', component: UserRegisterComponent},
  {path: 'user/signin', pathMatch: 'full', component: UserLoginFormComponent},
  {path: 'user', pathMatch: 'full', component: UserListComponent}
]

export const appRouterProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
