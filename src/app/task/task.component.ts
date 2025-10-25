import {Component, inject, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {Deliverable} from "../model/Deliverable";
import {Project} from "../model/Project";
import {Task} from "../model/Task";
import {User} from "../model/User";
import {Issue} from "../model/Issue";
import {Router} from "@angular/router";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  constructor(private router: Router) {}
  showForm = false;
  showIssue = false;
  ds = inject(DataService);
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  showDeletePopup = false;
  editMode = false;
  selectedId: string = "";
  deliverableList: Deliverable[] = this.ds.getDeliverables();
  userList: User[] = this.ds.getUsers();
  newTask: Partial<Task> = {
    deliverableId: '', taskType: '', taskTitle: '', taskDescription: '',
    assignee: '', reviewer: '', priority: '', planStartDate: '', planEndDate: '', estimateHours: ''
  };

  newIssue: Partial<Issue> = {
    taskId: '', issuetitle: '', issuedescription: '', actionOwner: '', priority: '', status: ''
  }

  ngOnInit(): void {
    this.tasks = this.ds.tasks();
  }

  openAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.newTask = {
      deliverableId: '', taskType: '', taskTitle: '', taskDescription: '',
      assignee: '', reviewer: '', priority: '', planStartDate: '', planEndDate: '', estimateHours: ''
    };
  }

  cancel() {
    this.showForm = false;
    this.selectedId;
    this.newTask = {
      deliverableId: '', taskType: '', taskTitle: '', taskDescription: '',
      assignee: '', reviewer: '', priority: '', planStartDate: '', planEndDate: '', estimateHours: ''
    };
  }

  // Save or update user
  saveTask() {
    let updatedList: Task[];

    if (this.editMode && this.selectedId) {
      updatedList = this.ds.getTasks().map(task =>
        task.id === this.selectedId ? {...task, ...this.newTask} as Task : task
      );
    } else {
      const newItem: Task = {
        id: `task${this.ds.tasks().length + 1}`,
        deliverableId: this.newTask.deliverableId!,
        taskType: this.newTask.taskType!,
        taskTitle: this.newTask.taskTitle!,
        taskDescription: this.newTask.taskDescription!,
        assignee: this.newTask.assignee!,
        reviewer: this.newTask.reviewer!,
        priority: this.newTask.priority!,
        planStartDate: this.newTask.planStartDate!,
        planEndDate: this.newTask.planEndDate!,
        estimateHours: this.newTask.estimateHours
      };

      updatedList = [...this.ds.getTasks(), newItem];
    }

    this.ds.updateTasks(updatedList);

    this.tasks = this.ds.getTasks();
    this.cancel();
  }

  // Edit existing user
  editTask(task: Task) {
    this.showForm = true;
    this.editMode = true;
    this.selectedId = task.id!;
    this.newTask = {...task};
  }

  // Open delete confirmation popup
  openDeletePopup(task: Task) {
    this.selectedTask = task;
    this.showDeletePopup = true;
  }

  // Confirm delete
  confirmDelete() {
    if (!this.tasks) return;

    const updatedList = this.ds.tasks().filter(item => item.id !== this.selectedTask!.id);
    this.ds.updateTasks(updatedList);

    this.tasks = this.ds.getTasks();
    this.showDeletePopup = false;
    this.selectedTask = null;
  }

  // Cancel delete
  cancelDelete() {
    this.showDeletePopup = false;
    this.selectedTask = null;
    this.showIssue = false;
  }

  addIssue(task:Task) {
    this.showIssue = true;
    this.selectedId = task.id!;
  }
  saveIssue(){
    let updatedList: Issue[];
    const newItem: Issue = {
      id: `issue${this.ds.issues().length + 1}`,
      taskId:this.selectedId,
      issuetitle: this.newIssue.issuetitle!,
      issuedescription: this.newIssue.issuedescription!,
      actionOwner: this.newIssue.actionOwner!,
      priority: this.newIssue.priority!,
      status: this.newIssue.status!,
    };

    updatedList = [...this.ds.getIssues(), newItem];

  this.ds.updateIssues(updatedList);
  this.cancel();
  this.router.navigate(["/task_issue"]);
}

  // saveIssue() {
  //   let updatedList: Task[];
  //
  //   if (this.editMode && this.selectedId) {
  //     updatedList = this.ds.getTasks().map(task =>
  //       task.id === this.selectedId ? { ...task, ...this.newTask } as Task : task
  //     );
  //   } else {
  //     const newItem: Task = {
  //       id: `task${this.ds.tasks().length + 1}`,
  //       deliverableId:this.newTask.deliverableId!,
  //       taskType: this.newTask.taskType!,
  //       taskTitle: this.newTask.taskTitle!,
  //       taskDescription:this.newTask.taskDescription!,
  //       assignee:this.newTask.assignee!,
  //       reviewer:this.newTask.reviewer!,
  //       priority:this.newTask.priority!,
  //       planStartDate:this.newTask.planStartDate!,
  //       planEndDate:this.newTask.planEndDate!,
  //       estimateHours:this.newTask.estimateHours
  //     };
  //
  //     updatedList = [...this.ds.getTasks(), newItem];
  //   }
  //
  //   this.ds.updateTasks(updatedList);
  //
  //   this.tasks = this.ds.getTasks();
  //   this.cancel();
  // }

}
