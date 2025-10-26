import {Component, inject, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {Project} from "../model/Project";
import {BU} from "../model/bu";
import {User} from "../model/User";
import {Deliverable} from "../model/Deliverable";

@Component({
  selector: 'app-deliverable',
  templateUrl: './deliverable.component.html',
  styleUrls: ['./deliverable.component.scss']
})
export class DeliverableComponent implements OnInit{
  showForm = false;
  ds = inject(DataService);
  deliverables: Deliverable[] = [];
  selectedDeliverable: Deliverable | null = null;
  showDeletePopup = false;
  editMode = false;
  selectedId: string = "";
  projectList:Project[]=this.ds.getProjects();
  newDeliverable: Partial<Deliverable> = {projectId: '', title:'', description:'',priority:'',plannedStartDate:'',plannedEndDate:''};
  ngOnInit(): void {
    this.deliverables = this.ds.deliverables();
  }
  openAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.newDeliverable = { projectId: '', title:'', description:'',priority:'',plannedStartDate:'',plannedEndDate:''};
  }
  cancel() {
    this.showForm = false;
    this.selectedId;
    this.newDeliverable = { projectId: '', title:'', description:'',priority:'',plannedStartDate:'',plannedEndDate:''};
  }
  // Save or update user
  saveDeliverable() {
    let updatedList: Deliverable[];

    if (this.editMode && this.selectedId) {
      updatedList = this.ds.getDeliverables().map(deliverable =>
        deliverable.id === this.selectedId ? { ...deliverable, ...this.newDeliverable } as Deliverable : deliverable
      );
    } else {
      const newItem: Deliverable = {
        id: `deliverable${this.ds.getDeliverables().length + 1}`,
        projectId:this.newDeliverable.projectId!,
        title: this.newDeliverable.title!,
        description: this.newDeliverable.description!,
        priority:this.newDeliverable.priority!,
        plannedStartDate:this.newDeliverable.plannedStartDate!,
        plannedEndDate:this.newDeliverable.plannedEndDate!
      };

      updatedList = [...this.ds.deliverables(), newItem];
    }

    this.ds.updateDeliverables(updatedList);

    this.deliverables = this.ds.getDeliverables();
    this.cancel();
  }

  // Edit existing user
  editUser(deliverable: Deliverable) {
    this.showForm = true;
    this.editMode = true;
    this.selectedId = deliverable.id!;
    this.newDeliverable = { ...deliverable };
  }

  // Open delete confirmation popup
  openDeletePopup(deliverable: Deliverable) {
    this.selectedDeliverable = deliverable;
    this.showDeletePopup = true;
  }

  // Confirm delete
  confirmDelete() {
    if (!this.deliverables) return;

    const updatedList = this.ds.deliverables().filter(item => item.id !== this.selectedDeliverable!.id);
    this.ds.updateDeliverables(updatedList);

    this.deliverables = this.ds.getDeliverables();
    this.showDeletePopup = false;
    this.selectedDeliverable = null;
  }
  // Cancel delete
  cancelDelete() {
    this.showDeletePopup = false;
    this.selectedDeliverable = null;
  }
}
