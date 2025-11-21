import { Component, OnInit, inject, Signal } from '@angular/core';
import { DataService } from '../data.service';
import { Timesheet, TimesheetCreate, TimesheetUpdate } from '../model/timesheet';
import { Task } from '../model/task';
import { AuthService } from '../auth/auth.service';
import { Project } from '../model/project';
import { Deliverable } from '../model/deliverable';
import { BusinessUnit } from '../model/business_unit';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
})
export class TimesheetComponent implements OnInit {
  private ds = inject(DataService);
  private auth = inject(AuthService);

  timesheets: Signal<Timesheet[]> = this.ds.timesheets;
  timesheetLoading: Signal<boolean> = this.ds.timesheetLoading;
  timesheetError: Signal<string | null> = this.ds.timesheetError;
  tasks: Signal<Task[]> = this.ds.tasks;
  projects: Signal<Project[]> = this.ds.projects;
  deliverables: Signal<Deliverable[]> = this.ds.deliverables;
  businessUnits: Signal<BusinessUnit[]> = this.ds.bu;

  private nextTimesheetId = 101;

  showAddForm = false;
  showEditForm = false;
  showDeletePopup = false;

  selectedTimesheet: Timesheet | null = null;
  editingTimesheetId: string | null = null;

  newTimesheet: TimesheetCreate = {
    project_id: this.getNextAvailableId(),
    task_status_id: '',
    deliverable_id: '',
    task_id: '',
    action_date: '',
    hours_spent: '',
    progress: '',
    remarks: '',
  };

  editTimesheetModel: TimesheetUpdate = {
    business_unit_id: '',
    business_unit_name: '',
    business_unit_head_id: '',
    business_unit_head_name: '',
    project_id: '',
    task_status_id:'',
    project_name: '',
    delivery_manager_id: '',
    delivery_manager_name: '',
    deliverable_name: '',
    deliverable_id: '',
    task_name: '',
    task_id: '',
    action_date: '',
    progress: '',
    remarks: '',
    hours_spent: ''
  };

  columns: (keyof Timesheet)[] = [
    'business_unit_name',
    'project_name',
    'deliverable_name',
    'task_name',
    'action_date',
    'hours_spent',
    'progress',
    'remarks',
    'updated_at',
    'updated_by_name',
  ];

  columnLabels: Record<string, string> = {
  business_unit_name: 'BU',
  project_name: 'Project',
  deliverable_name: 'Deliverable',
  task_name: 'Task',
  action_date: 'Action Date',
  hours_apent:'Hours Spent',
  progress: 'Progress',
  remarks: 'Remarks',
  updated_at: 'Updated At',
  updated_by_name: 'Updated By'
};

  activeFilter: keyof Timesheet | null = null;
  selectedFilters: Partial<Record<keyof Timesheet, string[]>> = {};

  ngOnInit(): void {
    this.ds.fetchTimesheets().subscribe();
    this.ds.fetchTasks().subscribe();
    this.ds.fetchProjects().subscribe();
    this.ds.fetchDeliverables().subscribe();
    this.ds.fetchBU().subscribe();
  }

  applyDefaultFilters(): void {
    const user = this.auth.getAuthenticatedUser();
    if (user && user.employee_full_name) {
      this.selectedFilters['created_by_name'] = [user.employee_full_name];
    }
  }

  get filteredTimesheets(): Timesheet[] {
    let list = this.timesheets();
    for (const key in this.selectedFilters) {
      const k = key as keyof Timesheet;
      const values = this.selectedFilters[k];
      if (values?.length) {
        list = list.filter((ts) => values.includes(ts[k]!));
      }
    }
    return list;
  }

  toggleFilter(column: keyof Timesheet) {
    this.activeFilter = this.activeFilter === column ? null : column;
  }

  getUniqueOptions(column: keyof Timesheet): string[] {
    const values = this.timesheets().map((ts) => ts[column] || '');
    return Array.from(new Set(values));
  }

  isSelected(column: keyof Timesheet, value: string): boolean {
    return this.selectedFilters[column]?.includes(value) ?? false;
  }

  toggleSelection(column: keyof Timesheet, value: string) {
    if (!this.selectedFilters[column]) this.selectedFilters[column] = [];
    const idx = this.selectedFilters[column]!.indexOf(value);
    idx > -1
      ? this.selectedFilters[column]!.splice(idx, 1)
      : this.selectedFilters[column]!.push(value);
    this.activeFilter = null;
  }

  clearAllFilters() {
    this.selectedFilters = {};
  }

  clearFilter(column: keyof Timesheet, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFilters[column] = [];
    this.activeFilter = null;
  }

  hasFilter(column: keyof Timesheet): boolean {
    return (this.selectedFilters[column]?.length ?? 0) > 0;
  }

  getFilterCount(column: keyof Timesheet): number {
    return this.selectedFilters[column]?.length ?? 0;
  }

  openAddForm(): void {
    this.showAddForm = true;
    this.showEditForm = false;
    this.newTimesheet = {
      deliverable_id: '',
      project_id: '',
      task_status_id: this.getNextAvailableId(),
      task_id: '',
      action_date: '',
      hours_spent: '',
      progress: '',
      remarks: '',
    };
    this.editingTimesheetId = null;
  }

  getNextAvailableId(): string {
    const alltimesheets = this.timesheets(); 
    if (!alltimesheets) return '101';
    const ids = alltimesheets
     .map(e => Number(e.task_status_id))
     .filter(n => !isNaN(n));
    return (Math.max(...ids) + 1).toString();
  }

  saveNewTimesheet(): void {
    if (!this.newTimesheet.task_id || !this.newTimesheet.action_date) {
      console.error('Task and Action Date are required.');
      return;
    }
    this.ds.createTimesheet(this.newTimesheet).subscribe({
      next: () => this.cancelForms(),
      error: (err) => console.error('Creation failed:', err),
    });
  }

  openEditForm(ts: Timesheet): void {
    this.showEditForm = true;
    this.showAddForm = false;
    this.editingTimesheetId = ts.task_status_id;
    this.editTimesheetModel = { ...ts } as TimesheetUpdate;
  }

  saveEditTimesheet(): void {
    if (!this.editingTimesheetId) return;
    this.ds.updateTimesheet(this.editingTimesheetId, this.editTimesheetModel).subscribe({
      next: () => this.cancelForms(),
      error: (err) => console.error('Update failed:', err),
    });
  }

  openDeletePopup(ts: Timesheet): void {
    this.selectedTimesheet = ts;
    this.showDeletePopup = true;
  }

  confirmDelete(): void {
    if (this.selectedTimesheet?.task_status_id) {
      this.ds.deleteTimesheet(this.selectedTimesheet.task_status_id).subscribe({
        next: () => this.cancelForms(),
        error: (err) => console.error('Delete failed:', err),
      });
    }
  }

  cancelForms(): void {
    this.showAddForm = false;
    this.showEditForm = false;
    this.showDeletePopup = false;
    this.selectedTimesheet = null;
    this.editingTimesheetId = null;
  }
}
