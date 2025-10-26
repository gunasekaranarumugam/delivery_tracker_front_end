import {Component, inject} from '@angular/core';
import {DataService} from "../data.service";
import {Deliverable} from "../model/Deliverable";
import {Project} from "../model/Project";
import {Timesheet} from "../model/Timesheet";
import {Time} from "@angular/common";
import {Task} from "../model/Task";
import {User} from "../model/User";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent {
  showForm = false;
  ds = inject(DataService);
  timesheets: Timesheet[] = [];
  selectedTimesheet: Timesheet | null = null;
  showDeletePopup = false;
  editMode = false;
  selectedId: string = "";
  taskList:Task[]=this.ds.getTasks();
  userList:User[]=this.ds.getUsers();
  newTimesheet: Partial<Timesheet> = {taskid: '', employee:'', workDate:'', progressPercentage:0,remark:''};
  ngOnInit(): void {
    this.timesheets = this.ds.timesheets();
  }
  openAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.newTimesheet = {taskid: '', employee:'', workDate:'', progressPercentage:0,remark:''};
  }
  cancel() {
    this.showForm = false;
    this.selectedId;
    this.newTimesheet = {taskid: '', employee:'', workDate:'', progressPercentage:0,remark:''};
  }
  // Save or update user
  saveTimesheet() {
    let updatedList: Timesheet[];

    if (this.editMode && this.selectedId) {
      updatedList = this.ds.getTimesheets().map(timesheet =>
        timesheet.id === this.selectedId ? { ...timesheet, ...this.newTimesheet } as Timesheet : timesheet
      );
    } else {
      const newItem: Timesheet = {
        id: `timesheet${this.ds.getTimesheets().length + 1}`,
        taskid:this.newTimesheet.taskid!,
        employee: this.newTimesheet.employee!,
        workDate:this.newTimesheet.workDate!,
        progressPercentage: this.newTimesheet.progressPercentage!,
        remark:this.newTimesheet.remark!,
      };

      updatedList = [...this.ds.timesheets(), newItem];
    }

    this.ds.updateTimesheets(updatedList);

    this.timesheets = this.ds.getTimesheets();
    this.cancel();
  }

  // Edit existing user
  editUser(timesheet: Timesheet) {
    this.showForm = true;
    this.editMode = true;
    this.selectedId = timesheet.id!;
    this.newTimesheet = { ...timesheet };
  }

  // Open delete confirmation popup
  openDeletePopup(timesheet: Timesheet) {
    this.selectedTimesheet = timesheet;
    this.showDeletePopup = true;
  }

  // Confirm delete
  confirmDelete() {
    if (!this.timesheets) return;

    const updatedList = this.ds.timesheets().filter(item => item.id !== this.selectedTimesheet!.id);
    this.ds.updateTimesheets(updatedList);

    this.timesheets = this.ds.getTimesheets();
    this.showDeletePopup = false;
    this.selectedTimesheet = null;
  }
  // Cancel delete
  cancelDelete() {
    this.showDeletePopup = false;
    this.selectedTimesheet = null;
  }
}
