import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {BusinessunitComponent} from "./BU/businessunit/businessunit.component";
import {UserComponent} from "./BU/User/user.component";
import {ProjectComponent} from "./project/project.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'bu', component:BusinessunitComponent},
  {path:'user',component:UserComponent},
  {path:'project',component:ProjectComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
