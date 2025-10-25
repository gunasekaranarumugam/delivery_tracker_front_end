import {Injectable, signal} from '@angular/core';
import {BU} from "./model/bu";
import {User} from "./model/User";
import {Project} from "./model/Project";
import {Deliverable} from "./model/Deliverable";
import {Task} from "./model/Task";
import {Issue} from "./model/Issue";
import {Timesheet} from "./model/Timesheet";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { }

  bu = signal<BU[]>([
    { id: 1, name: 'BU Alpha', lead: 'A.Kumar' },
    { id: 2, name: 'BU Beta',  lead: 'S.Rao'}
  ]);
  update(newList: BU[]) {
    this.bu.set(newList);
  }

  getBU(): BU[] {
    return this.bu();
  }

  users = signal<User[]>([
    {
      id: 'U001',
      fullname: 'Anil Kumar',
      email: 'anil.kumar@example.com',
    },
    {
      id: 'U002',
      fullname: 'Sita Rao',
      email: 'sita.rao@example.com',
    },
    {
      id: 'U003',
      fullname: 'Ravi Patel',
      email: 'ravi.patel@example.com',
    },
    {
      id: 'U004',
      fullname: 'Divya Sharma',
      email: 'divya.sharma@example.com',
    }
  ]);

  updateUser(newList: User[]) {
    this.users.set(newList);
  }

  getUsers(): User[] {
    return this.users();
  }

  projects = signal<Project[]>([
    {
      id: 'Project 1',
      buId: 'BU Alpha',
      name: 'Website Redesign',
      projectManager:'Divya Sharma',
      description: 'Revamp company website with new UX/UI design',
      craetedat:'2025-01-09',
      baselinestart:'2025-01-01',
      baselineend:'2025-01-05',
      plannedStart: '2025-01-10',
      plannedEnd: '2025-03-30'
    },
    {
      id: 'Project 2',
      buId: 'BU Alpha',
      name: 'Finance Automation',
      projectManager:'Anil Kumar',
      description: 'Automate monthly financial reporting using Power BI',
      craetedat:'2025-01-01',
      baselinestart:'2025-02-02',
      baselineend:'2025-02-05',
      plannedStart: '2025-02-01',
      plannedEnd: '2025-05-15'
    },
    {
      id: 'Project 3',
      buId: 'BU Beta',
      name: 'Employee Training Portal',
      projectManager:'Sita Rao',
      description: 'Develop e-learning platform for internal training',
      craetedat:'2024-03-03',
      baselinestart:'2025-04-01',
      baselineend:'2025-04-05',
      plannedStart: '2025-04-01',
      plannedEnd: '2025-06-30'
    }
  ]);

  getProjects(): Project[] {
    return this.projects();
  }
  updateProject(newList:Project[]) {
    return this.projects.set(newList);
  }

  deliverables = signal<Deliverable[]>([
    {
      id: 'D001',
      projectId: 'P001',
      title: 'UI Design',
      description: 'Create wireframes and UI mockups for the main dashboard.',
      priority: 'High',
      plannedStartDate: '2025-10-25',
      plannedEndDate: '2025-11-05',
    },
    {
      id: 'D002',
      projectId: 'P001',
      title: 'Backend API Setup',
      description: 'Develop and deploy REST APIs for authentication and data access.',
      priority: 'Medium',
      plannedStartDate: '2025-10-26',
      plannedEndDate: '2025-11-10',
    },
    {
      id: 'D003',
      projectId: 'P002',
      title: 'Testing & QA',
      description: 'Perform integration and user acceptance testing.',
      priority: 'Low',
      plannedStartDate: '2025-11-01',
      plannedEndDate: '2025-11-15',
    },
  ]);

  updateDeliverables(newList: Deliverable[]) {
    this.deliverables.set(newList);
  }

  getDeliverables(): Deliverable[] {
    return this.deliverables();
  }

  tasks = signal<Task[]>([
    {
      id: 'T001',
      deliverableId: 'D001',
      taskType: 'Development',
      taskTitle: 'Frontend UI Implementation',
      taskDescription: 'Implement the dashboard UI using Angular',
      assignee: 'Anil Kumar',
      reviewer: 'Divya Sharma',
      priority: 'High',
      planStartDate: '2025-01-10',
      planEndDate: '2025-01-15',
      estimateHours: '40'
    },
    {
      id: 'T002',
      deliverableId: 'D001',
      taskType: 'Testing',
      taskTitle: 'Integration Testing',
      taskDescription: 'Perform API integration testing with backend',
      assignee: 'Ravi Patel',
      reviewer: 'Sita Rao',
      priority: 'Medium',
      planStartDate: '2025-01-16',
      planEndDate: '2025-01-20',
      estimateHours: '30'
    },
    {
      id: 'T003',
      deliverableId: 'D002',
      taskType: 'Design',
      taskTitle: 'Wireframe Creation',
      taskDescription: 'Design wireframes for new finance module',
      assignee: 'Divya Sharma',
      reviewer: 'Anil Kumar',
      priority: 'Low',
      planStartDate: '2025-02-01',
      planEndDate: '2025-02-05',
      estimateHours: '20'
    },
    {
      id: 'T004',
      deliverableId: 'D003',
      taskType: 'Documentation',
      taskTitle: 'API Documentation',
      taskDescription: 'Prepare detailed API documentation for the project',
      assignee: 'Sita Rao',
      reviewer: 'Ravi Patel',
      priority: 'Medium',
      planStartDate: '2025-02-10',
      planEndDate: '2025-02-15',
      estimateHours: '25'
    }
  ]);

  getTasks(): Task[] {
    return this.tasks();
  }

  updateTasks(newList: Task[]) {
    this.tasks.set(newList);
  }

  issues = signal<Issue[]>([
    {
      id: 'I001',
      taskId: 'T001',
      issuetitle: 'UI alignment issue',
      issuedescription: 'Dashboard widgets are misaligned on smaller screens.',
      actionOwner: 'Anil Kumar',
      priority: 'High',
      status: 'Open'
    },
    {
      id: 'I002',
      taskId: 'T002',
      issuetitle: 'API response delay',
      issuedescription: 'The integration API takes over 5 seconds to respond.',
      actionOwner: 'Ravi Patel',
      priority: 'Medium',
      status: 'In Progress'
    },
    {
      id: 'I003',
      taskId: 'T003',
      issuetitle: 'Missing wireframe link',
      issuedescription: 'The link to the wireframe document is broken.',
      actionOwner: 'Divya Sharma',
      priority: 'Low',
      status: 'Resolved'
    },
    {
      id: 'I004',
      taskId: 'T004',
      issuetitle: 'Typo in API docs',
      issuedescription: 'Several spelling mistakes found in the documentation.',
      actionOwner: 'Sita Rao',
      priority: 'Low',
      status: 'Closed'
    }
  ]);

  getIssues(): Issue[] {
    return this.issues();
  }

  updateIssues(newList: Issue[]) {
    this.issues.set(newList);
  }


  timesheets = signal<Timesheet[]>([
    {
      id: 'TS001',
      taskid:'Task001',
      employee: 'Anil Kumar',
      workDate: '2025-10-20',
      progressPercentage: 80,
      remark: 'Completed module integration.'
    },
    {
      id: 'TS002',
      taskid:'Task002',
      employee: 'Ravi Patel',
      workDate: '2025-10-21',
      progressPercentage: 60,
      remark: 'Working on API optimization.'
    },
    {
      id: 'TS003',
      taskid:'Task003',
      employee: 'Divya Sharma',
      workDate: '2025-10-22',
      progressPercentage: 100,
      remark: 'Reviewed UI feedback.'
    },
    {
      id: 'TS004',
      taskid:'Task004',
      employee: 'Sita Rao',
      workDate: '2025-10-23',
      progressPercentage: 40,
      remark: 'Started documentation updates.'
    }
  ]);

  // Method to get all timesheets
  getTimesheets(): Timesheet[] {
    return this.timesheets();
  }

  // Method to update timesheets
  updateTimesheets(newList: Timesheet[]) {
    this.timesheets.set(newList);
  }

  // Optional: Method to add a single timesheet
  addTimesheet(newTimesheet: Timesheet) {
    this.timesheets.update(list => [...list, newTimesheet]);
  }
}
