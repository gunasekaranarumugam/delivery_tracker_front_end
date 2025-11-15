import { Component, OnInit, inject, Signal } from '@angular/core';
import { DataService } from '../data.service';
import { Issue, IssueCreate, IssueUpdate } from '../model/Issue';
import { Task } from '../model/Task';
import { Employee } from '../model/Employee';
import { Deliverable } from '../model/Deliverable';
import { Project } from '../model/Project';
import { BU } from '../model/bu';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {
  private ds = inject(DataService);

  // --- Signals from DataService ---
  issues: Signal<Issue[]> = this.ds.issues;
  projects: Signal<Project[]> = this.ds.projects;
  tasks: Signal<Task[]> = this.ds.tasks;
  bus: Signal<BU[]> = this.ds.bu;
  deliverables: Signal<Deliverable[]> = this.ds.deliverables;
  employees: Signal<Employee[]> = this.ds.employees;
  loading: Signal<boolean> = this.ds.issueLoading;
  error: Signal<string | null> = this.ds.issueError;

  // --- Component UI State ---
  showForm = false;
  editMode = false;
  showDeletePopup = false;
  selectedIssue: Issue | null = null;

  // --- Form Models ---
  newIssue: Partial<IssueCreate & IssueUpdate> = {};

  // --- Columns for table & filters ---
  columns: (keyof Issue)[] = [
    'business_unit_name', 'project_name', 'deliverable_name', 'task_name',
    'issue_title', 'issue_description', 'action_owner_name', 'issue_priority',
    'issue_status', 'created_at', 'created_by_name', 'updated_at', 'updated_by_name'
  ];


  columnLabels: Record<string, string> = {
  business_unit_name: 'BU',
  project_name: 'Project',
  deliverable_name: 'Deliverable',
  task_name: 'Task',
  issue_title: 'Issue Title',
  issue_description: 'Issue Description',
  action_owner_name: 'Action Owner',
  issue_priority: 'Priority',
  issue_status: 'Status',
  created_at: 'Created At',
  created_by_name: 'Created By',
  updated_at: 'Updated At',
  updated_by_name: 'Updated By'
};

  // --- Filter Logic ---
  activeFilter: keyof Issue | null = null;
  selectedFilters: Partial<Record<keyof Issue, string[]>> = {};

  ngOnInit(): void {
    this.ds.fetchIssues().subscribe();
    this.ds.fetchTasks().subscribe();
    this.ds.fetchEmployees().subscribe();
    this.ds.fetchDeliverables().subscribe();
    this.ds.fetchProjects().subscribe();
    this.ds.fetchBU().subscribe();
  }

  // --- Computed filtered list ---
  get filteredIssues(): Issue[] {
    let list = this.issues();
    for (const key in this.selectedFilters) {
      const k = key as keyof Issue;
      const values = this.selectedFilters[k];
      if (values && values.length) {
        list = list.filter((i) => values.includes(i[k]!));
      }
    }
    return list;
  }

  // --- Filter Helpers ---
  toggleFilter(column: keyof Issue) {
    this.activeFilter = this.activeFilter === column ? null : column;
  }

  getUniqueOptions(column: keyof Issue): string[] {
    return Array.from(new Set(this.issues().map(i => i[column] || '')));
  }

  isSelected(column: keyof Issue, value: string): boolean {
    return this.selectedFilters[column]?.includes(value) ?? false;
  }

  toggleSelection(column: keyof Issue, value: string) {
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

  clearFilter(column: keyof Issue, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFilters[column] = [];
    this.activeFilter = null;
  }

  hasFilter(column: keyof Issue): boolean {
    return !!(this.selectedFilters[column] && this.selectedFilters[column]!.length > 0);
  }

  getFilterCount(column: keyof Issue): number {
    return this.selectedFilters[column]?.length || 0;
  }

  get hasActiveFilters(): boolean {
    return Object.keys(this.selectedFilters).some(
      k => this.selectedFilters[k as keyof Issue]?.length
    );
  }

  // --- CRUD Methods ---
  openAddForm() {
    this.showForm = true;
    this.editMode = false;
    this.newIssue = {};
    this.selectedIssue = null;
  }

  openEditForm(issue: Issue) {
    this.showForm = true;
    this.editMode = true;
    this.selectedIssue = issue;
    this.newIssue = {
      issue_id: issue.issue_id,
      task_id: issue.task_id,
      issue_title: issue.issue_title,
      issue_description: issue.issue_description,
      action_owner_id: issue.action_owner_id,
      issue_priority: issue.issue_priority,
      issue_status: issue.issue_status
    };
  }

  saveIssue() {
    if (!this.newIssue.issue_title || !this.newIssue.task_id || !this.newIssue.action_owner_id) {
      console.error('Title, Task, and Action Owner are required.');
      return;
    }

    if (this.editMode && this.selectedIssue?.issue_id) {
      const payload: IssueUpdate = {
        issue_id: this.selectedIssue.issue_id,
        task_id: this.newIssue.task_id!,
        issue_title: this.newIssue.issue_title!,
        issue_description: this.newIssue.issue_description || '',
        action_owner_name: this.newIssue.action_owner_name || '',
        action_owner_id: this.newIssue.action_owner_id || '',
        issue_priority: this.newIssue.issue_priority || 'Medium',
        issue_status: this.newIssue.issue_status || 'Open',
        business_unit_id: '',
        business_unit_name: this.newIssue.business_unit_name,
        project_id: '',
        project_name: '',
        deliverable_id: '',
        deliverable_name: '',
        task_name: ''
      };
      this.ds.updateIssue(this.selectedIssue.issue_id, payload).subscribe({
        next: () => this.cancelForms(),
        error: (err) => console.error('Update failed:', err)
      });
    } else {
      const payload: IssueCreate = {
        issue_id: '',
        task_id: this.newIssue.task_id!,
        issue_title: this.newIssue.issue_title!,
        issue_description: this.newIssue.issue_description || '',
        action_owner_id: this.newIssue.action_owner_id!,
        issue_priority: this.newIssue.issue_priority || 'Medium',
        issue_status: this.newIssue.issue_status || 'Open',
        entity_status: 'Active'
      };
      this.ds.createIssue(payload).subscribe({
        next: () => this.cancelForms(),
        error: (err) => console.error('Creation failed:', err)
      });
    }
  }

  openDeletePopup(issue: Issue) {
    this.selectedIssue = issue;
    this.showDeletePopup = true;
  }

  confirmDelete() {
    if (this.selectedIssue?.issue_id) {
      this.ds.deleteIssue(this.selectedIssue.issue_id).subscribe({
        next: () => this.cancelForms(),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  cancelForms() {
    this.showForm = false;
    this.showDeletePopup = false;
    this.editMode = false;
    this.selectedIssue = null;
    this.newIssue = {};
  }
}
