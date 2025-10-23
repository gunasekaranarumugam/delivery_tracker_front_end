import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import {FormsModule} from "@angular/forms";
import { BusinessunitComponent } from './BU/businessunit/businessunit.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserComponent } from './BU/User/user.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageHeaderComponent,
    BusinessunitComponent,
    SidebarComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
