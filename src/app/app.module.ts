import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { BusinessUnitComponent } from './business_unit/business_unit.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProjectComponent } from './project/project.component';
import { DeliverableComponent } from './deliverable/deliverable.component';
import { TaskComponent } from './task/task.component';
import { IssueComponent } from './issue/issue.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TokenInterceptor } from './auth/token.interceptor'; 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageHeaderComponent,
    BusinessUnitComponent,
    SidebarComponent,
    EmployeeComponent,
    ProjectComponent,
    DeliverableComponent,
    TaskComponent,
    IssueComponent,
    TimesheetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
