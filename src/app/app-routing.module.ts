import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {BusinessUnitComponent} from "./businessunit/businessunit.component";
import {EmployeeComponent} from "./employee/employee.component";
import {ProjectComponent} from "./project/project.component";
import {DeliverableComponent} from "./deliverable/deliverable.component";
import {TaskComponent} from "./task/task.component";
import {IssueComponent} from "./issue/issue.component";
import {TimesheetComponent} from "./timesheet/timesheet.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'bu', component:BusinessUnitComponent},
  {path:'employee',component:EmployeeComponent},
  {path:'project',component:ProjectComponent},
  {path:'deliverable',component:DeliverableComponent},
  {path:'tasks',component:TaskComponent},
  {path:'task_issue',component:IssueComponent},
  {path:'daily_status_report' , component:TimesheetComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
