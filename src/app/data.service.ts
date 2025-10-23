import {Injectable, signal} from '@angular/core';
import {BU} from "./model/bu";
import {User} from "./model/User";

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

}
