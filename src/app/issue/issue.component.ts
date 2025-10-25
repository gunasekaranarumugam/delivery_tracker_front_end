import {Component, inject, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {Deliverable} from "../model/Deliverable";
import {Project} from "../model/Project";
import {Issue} from "../model/Issue";
import {User} from "../model/User";
import {Task} from "../model/Task";

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit{
  showForm = false;
  ds = inject(DataService);
  issues: Issue[] = [];
  selectedIssue: Issue | null = null;
  showDeletePopup = false;
  editMode = false;
  selectedId: string = "";
  taskList:Task[]=this.ds.getTasks();
  userList: User[] = this.ds.getUsers();
  newIssue: Partial<Issue> = {
    taskId: '', issuetitle: '', issuedescription: '', actionOwner: '', priority: '', status: ''
  }
  ngOnInit(): void {
    this.issues = this.ds.issues();
  }
  openAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.newIssue ={
      taskId: '', issuetitle: '', issuedescription: '', actionOwner: '', priority: '', status: ''
    }
  }
  cancel() {
    this.showForm = false;
    this.selectedId;
    this.newIssue ={
      taskId: '', issuetitle: '', issuedescription: '', actionOwner: '', priority: '', status: ''
    }
  }
  // Save or update user
  saveIssue() {
    let updatedList: Issue[];

    if (this.editMode && this.selectedId) {
      updatedList = this.ds.getIssues().map(issue =>
        issue.id === this.selectedId ? { ...issue, ...this.newIssue } as Issue : issue
      );
    } else {
      const newItem: Issue = {
        id: `issue${this.ds.getIssues().length + 1}`,
        taskId:this.newIssue.taskId!,
        issuetitle: this.newIssue.issuetitle!,
        issuedescription: this.newIssue.issuedescription!,
        priority:this.newIssue.priority!,
        actionOwner:this.newIssue.actionOwner!,
        status:this.newIssue.status!
      };

      updatedList = [...this.ds.getIssues(), newItem];
    }

    this.ds.updateIssues(updatedList);

    this.issues = this.ds.getIssues();
    this.cancel();
  }

  // Edit existing user
  editUser(issue: Issue) {
    this.showForm = true;
    this.editMode = true;
    this.selectedId = issue.id!;
    this.newIssue = { ...issue }
    ;
  }

  // Open delete confirmation popup
  openDeletePopup(issue: Issue) {
    this.selectedIssue = issue;
    this.showDeletePopup = true;
  }

  // Confirm delete
  confirmDelete() {
    if (!this.issues) return;

    const updatedList = this.ds.issues().filter(item => item.id !== this.selectedIssue!.id);
    this.ds.updateIssues(updatedList);

    this.issues = this.ds.getIssues();
    this.showDeletePopup = false;
    this.selectedIssue = null;
  }
  // Cancel delete
  cancelDelete() {
    this.showDeletePopup = false;
    this.selectedIssue = null;
  }
}
