import { AuthService } from './../services/auth/auth.service';
import { PagesComponent } from './pages.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'authentication',
        pathMatch: 'full'
      },
      {
        path: 'authentication',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
      },
      {
        path: 'home',
        loadChildren: './home/home.module#HomeModule',
        canActivate: [AuthService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
