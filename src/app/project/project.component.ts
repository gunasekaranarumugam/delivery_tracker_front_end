import {Component, inject, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {User} from "../model/User";
import {Project} from "../model/Project";
import {BU} from "../model/bu";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit{
  showForm = false;
  ds = inject(DataService);
  projects: Project[] = [];
  selectedProject: Project | null = null;
  showDeletePopup = false;
  editMode = false;
  selectedId: string = "";
  selectedBuId:string='';
  buList:BU[]=this.ds.getBU();
  userList:User[]=this.ds.getUsers();
  newProject: Partial<Project> = {buId: '', name:'',projectManager:'', description:'',craetedat:'',baselinestart:'',baselineend:'',plannedStart:'',plannedEnd:''};
  ngOnInit(): void {
    this.projects = this.ds.projects();
  }
  openAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.newProject = { buId: '', name:'', projectManager:'', description:'',craetedat:'',baselinestart:'',baselineend:'',plannedStart:'',plannedEnd:''};
  }
  cancel() {
    this.showForm = false;
    this.selectedId;
    this.newProject = { buId: '', name:'', projectManager:'', description:'',craetedat:'',baselinestart:'',baselineend:'',plannedStart:'',plannedEnd:'' };
  }
  // Save or update user
  saveUser() {
    let updatedList: Project[];

    if (this.editMode && this.selectedId) {
      updatedList = this.ds.getProjects().map(project =>
        project.id === this.selectedId ? { ...project, ...this.newProject } as Project : project
      );
    } else {
      const newItem: Project = {
        id: `projest${this.ds.getProjects().length + 1}`,
        name: this.newProject.name!,
        projectManager:this.newProject.projectManager,
        description: this.newProject.description!,
        buId:this.newProject.buId!,
        craetedat: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'numeric',
        year: 'numeric'
      }),
        baselinestart:this.newProject.plannedStart!,
        baselineend:this.newProject.plannedEnd!,
        plannedStart:this.newProject.plannedStart!,
        plannedEnd:this.newProject.plannedEnd
      };
      console.log("bu :" + newItem.buId)
      console.log("bu :" + newItem.projectManager)

      updatedList = [...this.ds.projects(), newItem];
      console.log("updatedList :" +updatedList)
    }

    this.ds.updateProject(updatedList);

    this.projects = this.ds.getProjects();
    this.cancel();
  }

  // Edit existing user
  editUser(project: Project) {
    this.showForm = true;
    this.editMode = true;
    this.selectedId = project.id;
    this.newProject = { ...project };
  }

  // Open delete confirmation popup
  openDeletePopup(project: Project) {
    this.selectedProject = project;
    this.showDeletePopup = true;
  }

  // Confirm delete
  confirmDelete() {
    if (!this.selectedProject) return;

    const updatedList = this.ds.getProjects().filter(item => item.id !== this.selectedProject!.id);
    this.ds.updateProject(updatedList);

    this.projects = this.ds.getProjects();
    this.showDeletePopup = false;
    this.selectedProject = null;
  }
  // Cancel delete
  cancelDelete() {
    this.showDeletePopup = false;
    this.selectedProject = null;
  }
}
