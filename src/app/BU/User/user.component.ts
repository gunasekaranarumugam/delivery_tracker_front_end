import {Component, inject, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {User} from "../../model/User";

@Component({
  selector: 'app-User',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit{

  showForm = false;
  ds = inject(DataService);
  users: User[] = [];
  selectedUser: User | null = null;
  showDeletePopup = false;
  editMode = false;
  selectedId: string = "";
  newUser: Partial<User> = {fullname: '', email:''};
  ngOnInit(): void {
    this.users = this.ds.users();
  }
  openAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.newUser = { fullname: '', email: '' };
  }
  cancel() {
    this.showForm = false;
    this.selectedId;
    this.newUser = { fullname: '', email: '' };
  }
  // Save or update user
  saveUser() {
    let updatedList: User[];

    if (this.editMode && this.selectedId) {
      updatedList = this.ds.getUsers().map(user =>
        user.id === this.selectedId ? { ...user, ...this.newUser } as User : user
      );
    } else {
      const newItem: User = {
        id: `U${this.ds.getUsers().length + 1}`,
        fullname: this.newUser.fullname!,
        email: this.newUser.email!
      };
      console.log("new item :" +newItem.fullname);
      updatedList = [...this.ds.getUsers(), newItem];
      console.log("updatedList :" +updatedList)
    }

    this.ds.updateUser(updatedList);

    this.users = this.ds.getUsers();
    this.cancel();
  }

  // Edit existing user
  editUser(user: User) {
    this.showForm = true;
    this.editMode = true;
    this.selectedId = user.id;
    this.newUser = { ...user };
  }

  // Open delete confirmation popup
  openDeletePopup(user: User) {
    this.selectedUser = user;
    this.showDeletePopup = true;
  }

  // Confirm delete
  confirmDelete() {
    if (!this.selectedUser) return;

    const updatedList = this.ds.getUsers().filter(item => item.id !== this.selectedUser!.id);
    this.ds.updateUser(updatedList);

    this.users = this.ds.getUsers();
    this.showDeletePopup = false;
    this.selectedUser = null;
  }

  // Cancel delete
  cancelDelete() {
    this.showDeletePopup = false;
    this.selectedUser = null;
  }
}
