import {Injectable, signal} from '@angular/core';
import {BU} from "./model/bu";
import {User} from "./model/User";
import {Project} from "./model/Project";

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

}
