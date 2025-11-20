import { Component, OnInit, inject, Signal } from '@angular/core';
import { DataService } from '../data.service';
import { Deliverable, DeliverableCreate, DeliverableUpdate } from '../model/Deliverable';
import { Project } from '../model/Project';
import { Employee } from '../model/Employee';
import { BU } from '../model/bu';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-deliverable',
  templateUrl: './deliverable.component.html',
  styleUrls: ['./deliverable.component.scss']
})
export class DeliverableComponent implements OnInit {
  private ds = inject(DataService);
  private auth = inject(AuthService);

  // --- Signals from DataService ---
  deliverableItems: Signal<Deliverable[]> = this.ds.deliverables;
  deliverableLoading: Signal<boolean> = this.ds.deliverableLoading;
  deliverableError: Signal<string | null> = this.ds.deliverableError;
  projects: Signal<Project[]> = this.ds.projects;
  employees: Signal<Employee[]> = this.ds.employees;
  businessUnits: Signal<BU[]> = this.ds.bu;

  // --- Component State ---
  showCreateForm = false;
  showEditForm = false;
  showDeletePopup = false;

  selectedDeliverable: Deliverable | null = null;

  // --- Form Models ---
  newDeliverable: Partial<DeliverableCreate> = {
    deliverable_id: '',
    project_id: '',
    deliverable_name: '',
    deliverable_description: '',
    priority: '',
    baseline_start_date: '',
    baseline_end_date: ''
  };

  editDeliverableModel: DeliverableUpdate = {
    business_unit_name: '',
    business_unit_id: '',
    business_unit_head_id: '',
    business_unit_head_name: '',
    project_id: '',
    project_name: '',
    delivery_manager_id: '',
    delivery_manager_name: '',
    deliverable_id: '',
    deliverable_name: '',
    priority: '',
    planned_start_date: '',
    planned_end_date: '',
    baseline_start_date: '',
    baseline_end_date: ''
  };

  editingDeliverableId: string | null = null;

  // --- Columns for table & filters ---
  columns: (keyof Deliverable)[] = [
    'business_unit_name',
    'project_name',
    'deliverable_name',
    'priority',
    'planned_start_date',
    'planned_end_date',
    'updated_at',
    'updated_by_name'
  ];

  columnLabels: Record<string, string> = {
  business_unit_name: 'BU',
  project_name: 'Project',
  deliverable_name: 'Deliverable',
  priority: 'Priority',
  planned_start_date: 'Planned Start Date',
  planned_end_date: 'Planned End Date',
  updated_at: 'Updated At',
  updated_by_name: 'Updated By'
};



  // --- Filter logic ---
  activeFilter: keyof Deliverable | null = null;
  selectedFilters: Partial<Record<keyof Deliverable, string[]>> = {};

  ngOnInit(): void {
    this.ds.fetchDeliverables().subscribe(() => {
      // this.applyDefaultFilters();
    });
    this.ds.fetchProjects().subscribe();
    this.ds.fetchBU().subscribe();
    this.ds.fetchEmployees().subscribe();
  }

  applyDefaultFilters(): void {
    const user = this.auth.getAuthenticatedUser();
    if (user && user.employee_full_name) {
      // Apply default filter for Delivery Manager column based on logged-in employee's full name
      this.selectedFilters['delivery_manager_name'] = [user.employee_full_name];
    }
    
    console.log('Applied default filters for Deliverable:', this.selectedFilters);
    console.log('User details:', user);
  }

  // --- Computed filtered list ---
  get filteredDeliverables(): Deliverable[] {
    let list = this.deliverableItems();
    for (const key in this.selectedFilters) {
      const k = key as keyof Deliverable;
      const values = this.selectedFilters[k];
      if (values && values.length) {
        list = list.filter((d) => values.includes(d[k]!));
      }
    }
    return list;
  }

  // --- Filter Helpers ---
  toggleFilter(column: keyof Deliverable) {
    this.activeFilter = this.activeFilter === column ? null : column;
  }

  getUniqueOptions(column: keyof Deliverable): string[] {
    const values = this.deliverableItems().map((d) => d[column] || '');
    return Array.from(new Set(values));
  }

  isSelected(column: keyof Deliverable, value: string): boolean {
    return this.selectedFilters[column]?.includes(value) ?? false;
  }

  toggleSelection(column: keyof Deliverable, value: string) {
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

  clearFilter(column: keyof Deliverable, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFilters[column] = [];
    this.activeFilter = null;
  }

  get hasActiveFilters(): boolean {
    return Object.keys(this.selectedFilters).some(
      (k) => this.selectedFilters[k as keyof Deliverable]?.length
    );
  }

  hasActiveFilter(column: keyof Deliverable): boolean {
    return (this.selectedFilters[column]?.length ?? 0) > 0;
  }

  getFilterCount(column: keyof Deliverable): number {
    return this.selectedFilters[column]?.length ?? 0;
  }

  // --- CRUD Methods ---

  // --- CREATE FORM ---
  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.newDeliverable = {
      deliverable_id: '',
      project_id: '',
      deliverable_name: '',
      deliverable_description: '',
      priority: '',
      baseline_start_date: '',
      baseline_end_date: ''
    };
  }

  saveNewDeliverable(): void {
    this.ds.createDeliverable(this.newDeliverable).subscribe({
      next: () => this.cancelForms(),
      error: (err) => console.error('Creation failed:', err)
    });
  }

  // --- EDIT FORM ---
  openEditForm(d: Deliverable): void {
    this.showEditForm = true;
    this.showCreateForm = false;
    this.editingDeliverableId = d.deliverable_id;
    this.editDeliverableModel = {
      business_unit_name: d.business_unit_name,
      business_unit_id: d.business_unit_id,
      business_unit_head_id: d.business_unit_head_id,
      business_unit_head_name: d.business_unit_head_name,
      project_id: d.project_id,
      project_name: d.project_name,
      delivery_manager_id: d.delivery_manager_id,
      delivery_manager_name: d.delivery_manager_name,
      deliverable_id: d.deliverable_id,
      deliverable_name: d.deliverable_name,
      priority: d.priority,
      planned_start_date: d.planned_start_date,
      planned_end_date: d.planned_end_date,
      baseline_start_date: d.baseline_start_date,
      baseline_end_date: d.baseline_end_date,
    };
  }

  saveEditDeliverable(): void {
    if (!this.editingDeliverableId) return;

    this.ds.updateDeliverable(this.editingDeliverableId, this.editDeliverableModel).subscribe({
      next: () => this.cancelForms(),
      error: (err) => console.error('Update failed:', err)
    });
  }

  // --- DELETE ---
  openDeletePopup(d: Deliverable): void {
    this.selectedDeliverable = d;
    this.showDeletePopup = true;
  }

  confirmDelete(): void {
    if (this.selectedDeliverable?.deliverable_id) {
      this.ds.deleteDeliverable(this.selectedDeliverable.deliverable_id).subscribe({
        next: () => this.cancelForms(),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  // --- CANCEL ---
  cancelForms(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showDeletePopup = false;
    this.selectedDeliverable = null;
    this.editingDeliverableId = null;
  }
}
