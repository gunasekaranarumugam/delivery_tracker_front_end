import { Component, OnInit, inject, Signal } from '@angular/core';
import { DataService } from '../data.service';
import { Deliverable, DeliverableCreate, DeliverableUpdate } from '../model/deliverable';
import { Project } from '../model/project';
import { Employee } from '../model/employee';
import { BusinessUnit } from '../model/business_unit';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-deliverable',
  templateUrl: './deliverable.component.html',
  styleUrls: ['./deliverable.component.scss']
})
export class DeliverableComponent implements OnInit {
  private ds = inject(DataService);
  private auth = inject(AuthService);

  deliverableItems: Signal<Deliverable[]> = this.ds.deliverables;
  deliverableLoading: Signal<boolean> = this.ds.deliverableLoading;
  deliverableError: Signal<string | null> = this.ds.deliverableError;
  projects: Signal<Project[]> = this.ds.projects;
  employees: Signal<Employee[]> = this.ds.employees;
  businessUnits: Signal<BusinessUnit[]> = this.ds.bu;

  showCreateForm = false;
  showEditForm = false;
  showDeletePopup = false;

  selectedDeliverable: Deliverable | null = null;

  private nextDeliverableId = 101;

  newDeliverable: Partial<DeliverableCreate> = {
    deliverable_id: this.getNextAvailableId(),
    project_id: '',
    deliverable_name: '',
    deliverable_description: '',
    priority: '',
    planned_start_date:'',
    planned_end_date: '',
    baseline_start_date:'',
    baseline_end_date:'',
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
    baseline_end_date: '',
  };

  editingDeliverableId: string | null = null;

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

  activeFilter: keyof Deliverable | null = null;
  selectedFilters: Partial<Record<keyof Deliverable, string[]>> = {};

  ngOnInit(): void {
    this.ds.fetchDeliverables().subscribe();
    this.ds.fetchProjects().subscribe();
    this.ds.fetchBU().subscribe();
    this.ds.fetchEmployees().subscribe();
  }

  applyDefaultFilters(): void {
    const user = this.auth.getAuthenticatedUser();
    if (user && user.employee_full_name) {
      this.selectedFilters['delivery_manager_name'] = [user.employee_full_name];
    }
  }

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

  getNextAvailableId(): string {
    const alldeliverables = this.deliverableItems(); 
    if (!alldeliverables) return '101';
    const ids = alldeliverables
      .map(e => Number(e.deliverable_id))
      .filter(n => !isNaN(n)); 
    return (Math.max(...ids) + 1).toString();
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

  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.newDeliverable = {
      deliverable_id: '',
      project_id: '',
      deliverable_name: '',
      deliverable_description: '',
      priority: '',
      baseline_start_date:'',
      baseline_end_date: '',
      planned_start_date:'',
      planned_end_date:'',
    };
  }

  saveNewDeliverable(): void {
    this.newDeliverable.baseline_start_date = this.newDeliverable.planned_start_date;
    this.newDeliverable.baseline_end_date = this.newDeliverable.planned_end_date;
    this.nextDeliverableId++;
    this.newDeliverable.deliverable_id = this.nextDeliverableId.toString();
    this.ds.createDeliverable(this.newDeliverable).subscribe({
      next: () => this.cancelForms(),
      error: (err) => console.error('Creation failed:', err)
    });
  }

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
  
  cancelForms(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showDeletePopup = false;
    this.selectedDeliverable = null;
    this.editingDeliverableId = null;
  }
}
