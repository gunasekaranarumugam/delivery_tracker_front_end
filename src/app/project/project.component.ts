import { Component, OnInit, inject, Signal } from '@angular/core';
import { DataService } from '../data.service';
import { Project, ProjectCreate, ProjectUpdate } from '../model/Project';
import { BU } from '../model/bu';
import { Employee } from '../model/Employee';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  private ds = inject(DataService);
  private auth = inject(AuthService);

  // --- Signals from DataService ---
  projects: Signal<Project[]> = this.ds.projects;
  loading: Signal<boolean> = this.ds.projectLoading;
  error: Signal<string | null> = this.ds.projectError;

  businessUnits: Signal<BU[]> = this.ds.bu;
  employees: Signal<Employee[]> = this.ds.employees;

  // --- Component State ---
  showCreateForm = false;
  showEditForm = false;
  showDeletePopup = false;

  selectedProject: Project | null = null;

  // --- Form Models ---
  newProject: ProjectCreate = {
    project_id: '',
    project_name: '',
    project_description: '',
    business_unit_id: '',
    delivery_manager_id: '',
    baseline_start_date: '',
    baseline_end_date: ''
  };

  editProjectModel: ProjectUpdate = {
    project_id: '',
    project_name: '',
    project_description: '',
    business_unit_id: '',
    business_unit_name: '',
    delivery_manager_id: '',
    delivery_manager_name: '',
    baseline_end_date: '',
    baseline_start_date: '',
  };

  editingProjectId: string | null = null;

  // --- Columns for table & filters ---
  columns: (keyof Project)[] = [
    'project_name',
    'business_unit_name',
    'delivery_manager_name',
    'project_description',
    'baseline_start_date',
    'baseline_end_date',
    'planned_start_date',
    'planned_end_date',
    'created_by_name',
    'created_at',
    'updated_at',
    'updated_by_name',
  ];

  columnLabels: Record<string, string> = {
  project_name: 'Project',
  business_unit_name: 'BU',
  delivery_manager_name: 'DM',
  project_description: 'Description',
  baseline_start_date: 'Baseline Start Date',
  baseline_end_date: 'Baseline End Date',
  planned_start_date: 'Planned Start Date',
  planned_end_date: 'Planned End Date',
  created_by_name: 'Created By',
  created_at: 'Created At',
  updated_at: 'Updated At',
  updated_by_name: 'Updated By'
};

  // --- Filter logic ---
  activeFilter: keyof Project | null = null;
  selectedFilters: Partial<Record<keyof Project, string[]>> = {};

  ngOnInit(): void {
    this.ds.fetchBU().subscribe();
    this.ds.fetchEmployees().subscribe();
    this.ds.fetchProjects().subscribe(() => {
      // this.applyDefaultFilters();
    });
  }

  applyDefaultFilters(): void {
    const user = this.auth.getAuthenticatedUser();
    if (user && user.employee_full_name) {
      // Apply default filter for Delivery Manager column based on logged-in employee's full name
      this.selectedFilters['delivery_manager_name'] = [user.employee_full_name];
    }
    
    console.log('Applied default filters for Project:', this.selectedFilters);
    console.log('User details:', user);
  }

  // --- Computed filtered list ---
  get filteredProjects(): Project[] {
    let list = this.projects();
    for (const key in this.selectedFilters) {
      const k = key as keyof Project;
      const values = this.selectedFilters[k];
      if (values && values.length) {
        list = list.filter(p => values.includes(p[k]!));
      }
    }
    return list;
  }

  // --- Filter Helpers ---
  toggleFilter(column: keyof Project) {
    this.activeFilter = this.activeFilter === column ? null : column;
  }

  getUniqueOptions(column: keyof Project): string[] {
    const values = this.projects().map(p => p[column] || '');
    return Array.from(new Set(values));
  }

  isSelected(column: keyof Project, value: string): boolean {
    return this.selectedFilters[column]?.includes(value) ?? false;
  }

  toggleSelection(column: keyof Project, value: string) {
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

  clearFilter(column: keyof Project, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFilters[column] = [];
    this.activeFilter = null;
  }

  hasFilter(column: keyof Project): boolean {
    return !!(this.selectedFilters[column] && this.selectedFilters[column]!.length > 0);
  }

  getFilterCount(column: keyof Project): number {
    return this.selectedFilters[column]?.length || 0;
  }

  get hasActiveFilters(): boolean {
    return Object.keys(this.selectedFilters).some(
      k => this.selectedFilters[k as keyof Project]?.length
    );
  }

  // --- CRUD Methods ---

  // --- CREATE FORM ---
  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.newProject = {
      project_id: '',
      project_name: '',
      project_description: '',
      business_unit_id: '',
      delivery_manager_id: '',
      baseline_start_date: '',
      baseline_end_date: ''
    };
  }

  saveNewProject(): void {
    const payload: Project = {
      ...this.newProject,
      business_unit_name: this.getBUName(this.newProject.business_unit_id),
      delivery_manager_name: this.getEmployeeName(this.newProject.delivery_manager_id),
      entity_status: 'Active',
      project_id: this.newProject.project_id || Math.random().toString(36).substr(2, 9)
    } as Project;

    this.ds.createProject(payload).subscribe({
      next: () => this.cancelForms(),
      error: err => console.error('Creation failed:', err)
    });
  }

  // --- EDIT FORM ---
  openEditForm(proj: Project): void {
    this.showEditForm = true;
    this.showCreateForm = false;
    this.editingProjectId = proj.project_id;
    this.editProjectModel = {
      ...proj
    };
  }

  saveEditProject(): void {
    if (!this.editingProjectId) return;
    const payload: ProjectUpdate = {
      ...this.editProjectModel,
      business_unit_name: this.getBUName(this.editProjectModel.business_unit_id),
      delivery_manager_name: this.getEmployeeName(this.editProjectModel.delivery_manager_id)
    };
    this.ds.updateProject(this.editingProjectId, payload).subscribe({
      next: () => this.cancelForms(),
      error: err => console.error('Update failed:', err)
    });
  }

  // --- DELETE ---
  openDeletePopup(proj: Project): void {
    this.selectedProject = proj;
    this.showDeletePopup = true;
  }

  confirmDelete(): void {
    if (this.selectedProject?.project_id) {
      this.ds.deleteProject(this.selectedProject.project_id).subscribe({
        next: () => this.cancelForms(),
        error: err => console.error('Delete failed:', err)
      });
    }
  }

  // --- Cancel ---
  cancelForms(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showDeletePopup = false;
    this.selectedProject = null;
    this.editingProjectId = null;
  }

  // --- Helpers ---
  getBUName(id?: string): string {
    return this.businessUnits().find(b => b.business_unit_id === id)?.business_unit_name || '';
  }

  getEmployeeName(id?: string): string {
    const emp = this.employees().find(e => e.employee_id === id);
    return emp ? `${emp.employee_full_name} (${emp.employee_email_address})` : '';
  }
}
