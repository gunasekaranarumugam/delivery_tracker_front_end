import {Component, inject, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {BU} from "../../model/bu";

@Component({
  selector: 'app-businessunit',
  templateUrl: './businessunit.component.html',
  styleUrls: ['./businessunit.component.scss']
})
export class BusinessunitComponent implements OnInit {
  bu_items: BU[] = [];
  showForm = false;
  ds = inject(DataService);
  selectedBU: any = null;
  showDeletePopup = false;
  editMode = false;
  selectedId: number | null = null;
  newBU: Partial<BU> = {name: '', lead: ''};

  ngOnInit(): void {
    this.bu_items = this.ds.bu();
  }
  openAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.newBU = {name: '', lead: ''};
  }

  cancel() {
    this.showForm = false;
    this.selectedId = null;
    this.newBU = {name: '', lead: ''};
  }

  saveBusinessUnit() {
    let updatedList: BU[];

    if (this.editMode && this.selectedId !== null) {
      //  Update existing BU
      updatedList = this.ds.getBU().map(bu =>
        bu.id === this.selectedId ? { ...bu, ...this.newBU } as BU : bu
      );
    } else {
      //  Add new BU
      const newItem: BU = {
        id: this.ds.getBU().length + 1,
        name: this.newBU.name!,
        lead: this.newBU.lead!
      };
      updatedList = [...this.ds.getBU(), newItem];
    }

    // ✅ Apply the update to the signal
    this.ds.update(updatedList);

    // Refresh local list & close form
    this.bu_items = this.ds.getBU();
    this.cancel();
  }
  editBU(bu: BU) {
    this.showForm = true;
    this.editMode = true;
    this.selectedId = bu.id;
    this.newBU = { ...bu };
  }
  openDeletePopup(bu: any) {
    this.selectedBU = bu;
    this.showDeletePopup = true;
  }
  confirmDelete() {
    this.bu_items = this.bu_items.filter(item => item.id !== this.selectedBU.id);
    this.showDeletePopup = false;
    this.selectedBU = null;
  }
  cancelDelete() {
    this.showDeletePopup = false;
    this.selectedBU = null;
  }


}
