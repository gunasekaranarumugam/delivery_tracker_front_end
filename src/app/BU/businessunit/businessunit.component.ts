import { Component, OnInit, inject, Signal } from '@angular/core';
import { DataService } from '../../data.service';
import { BU, BusinessUnitCreate, BusinessUnitUpdate } from '../../model/bu';
import { Employee } from 'src/app/model/Employee';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-businessunit',
  templateUrl: './businessunit.component.html',
  styleUrls: ['./businessunit.component.scss'],
})
export class BusinessUnitComponent implements OnInit {
  private ds = inject(DataService);
  private auth = inject(AuthService);

  // --- Signals from DataService ---
  buItems: Signal<BU[]> = this.ds.bu;
  buLoading: Signal<boolean> = this.ds.buLoading;
  buError: Signal<string | null> = this.ds.buError;
  employees: Signal<Employee[]> = this.ds.employees;

  // --- Component State ---
  showCreateForm = false;
  showEditForm = false;
  showDeletePopup = false;

  selectedBU: BU | null = null;

  // --- Form Models ---
  newBU: BusinessUnitCreate = {
    business_unit_id: '',
    business_unit_name: '',
    business_unit_description: '',
    business_unit_head_id: '',
  };

  editBUModel: BusinessUnitUpdate = {
    business_unit_id: '',
    business_unit_name: '',
    business_unit_head_name: '',
    business_unit_description: '',
    business_unit_head_id: ''
  };

  editingBUId: string | null = null;

  // --- Columns for table & filters ---
  columns: (keyof BU)[] = [
    'business_unit_name',
    'business_unit_head_name',
    'business_unit_description',
    'created_by_name',
    'created_at',
    'updated_at',
    'updated_by_name',
  ];

  columnLabels: Record<string, string> = {
  business_unit_name: 'BU',
  business_unit_head_name: 'BU Head',
  business_unit_description: 'Description',
  created_by_name: 'Created By',
  created_at: 'Created At',
  updated_at: 'Updated At',
  updated_by_name: 'Updated By'
};


  // --- Filter logic ---
  activeFilter: keyof BU | null = null;
  selectedFilters: Partial<Record<keyof BU, string[]>> = {};

  ngOnInit(): void {
    this.ds.fetchBU().subscribe(() => {
      // this.applyDefaultFilters();
    });
    this.ds.fetchEmployees().subscribe();
  }

  applyDefaultFilters(): void {
    const user = this.auth.getAuthenticatedUser();
    if (user && user.employee_full_name) {
      // Apply default filter for BU Head column based on logged-in employee's full name
      this.selectedFilters['business_unit_head_name'] = [user.employee_full_name];
    }
    
    console.log('Applied default filters for BU:', this.selectedFilters);
    console.log('User details:', user);
  }

  // --- Computed filtered list ---
  get filteredBUs(): BU[] {
    let list = this.buItems();
    for (const key in this.selectedFilters) {
      const k = key as keyof BU;
      const values = this.selectedFilters[k];
      if (values && values.length) {
        list = list.filter((bu) => values.includes(bu[k]!));
      }
    }
    return list;
  }

  // --- Filter Helpers ---
  toggleFilter(column: keyof BU) {
    this.activeFilter = this.activeFilter === column ? null : column;
  }

  getUniqueOptions(column: keyof BU): string[] {
    const values = this.buItems().map((bu) => bu[column] || '');
    return Array.from(new Set(values));
  }

  isSelected(column: keyof BU, value: string): boolean {
    return this.selectedFilters[column]?.includes(value) ?? false;
  }

  toggleSelection(column: keyof BU, value: string) {
    if (!this.selectedFilters[column]) this.selectedFilters[column] = [];

    const idx = this.selectedFilters[column]!.indexOf(value);
    if (idx > -1) {
      this.selectedFilters[column]!.splice(idx, 1);
    } else {
      this.selectedFilters[column]!.push(value);
    }
    this.activeFilter = null;
  }

  clearAllFilters() {
    this.selectedFilters = {};
  }

  clearFilter(column: keyof BU, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFilters[column] = [];
    this.activeFilter = null;
  }

  hasFilter(column: keyof BU): boolean {
    return !!(this.selectedFilters[column] && this.selectedFilters[column]!.length > 0);
  }

  getFilterCount(column: keyof BU): number {
    return this.selectedFilters[column]?.length || 0;
  }

  get hasActiveFilters(): boolean {
    return Object.keys(this.selectedFilters).some(
      (k) => this.selectedFilters[k as keyof BU]?.length
    );
  }

  // --- CRUD Methods ---

  // --- CREATE FORM ---
  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.newBU = {
      business_unit_id: '',
      business_unit_name: '',
      business_unit_description: '',
      business_unit_head_id: '',
    };
  }

  saveNewBU(): void {
    this.ds.createBU(this.newBU).subscribe({
      next: () => this.cancelForms(),
      error: (err) => console.error('Creation failed:', err),
    });
  }

  // --- EDIT FORM ---
  openEditForm(bu: BU): void {
    this.showEditForm = true;
    this.showCreateForm = false;
    this.editingBUId = bu.business_unit_id;
    this.editBUModel = {
      business_unit_head_id: bu.business_unit_head_id,
      business_unit_id: bu.business_unit_id,
      business_unit_name: bu.business_unit_name,
      business_unit_head_name: bu.business_unit_head_name,
      business_unit_description: bu.business_unit_description,
    };
  }

  saveEditBU(): void {
    if (!this.editingBUId) return;

    this.ds.updateBU(this.editingBUId, this.editBUModel).subscribe({
      next: () => this.cancelForms(),
      error: (err) => console.error('Update failed:', err),
    });
  }

  // --- DELETE ---
  openDeletePopup(bu: BU): void {
    this.selectedBU = bu;
    this.showDeletePopup = true;
  }

  confirmDelete(): void {
    if (this.selectedBU?.business_unit_id) {
      this.ds.deleteBU(this.selectedBU.business_unit_id).subscribe({
        next: () => this.cancelForms(),
        error: (err) => console.error('Delete failed:', err),
      });
    }
  }

  // --- CANCEL ---
  cancelForms(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showDeletePopup = false;
    this.selectedBU = null;
    this.editingBUId = null;
  }
}
