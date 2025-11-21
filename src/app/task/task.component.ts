import { Component, OnInit, inject, Signal } from '@angular/core';
import { DataService } from '../data.service';
import { Task, TaskCreate, TaskUpdate } from '../model/task';
import { Deliverable } from '../model/deliverable';
import { Employee } from '../model/employee';
import { Project } from '../model/project';
import { BusinessUnit } from '../model/business_unit';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  private ds = inject(DataService);
  private auth = inject(AuthService);


  taskItems: Signal<Task[]> = this.ds.tasks;
  taskLoading: Signal<boolean> = this.ds.taskLoading;
  taskError: Signal<string | null> = this.ds.taskError;
  deliverables: Signal<Deliverable[]> = this.ds.deliverables;
  employees: Signal<Employee[]> = this.ds.employees;
  projects: Signal<Project[]> = this.ds.projects;
  businessUnits: Signal<BusinessUnit[]> = this.ds.bu;

 
  showCreateForm = false;
  showEditForm = false;
  showDeletePopup = false;

  selectedTask: Task | null = null;
  editingTaskId: string | null = null;

  private nextTaskId = 101;


  newTask: Partial<TaskCreate> = {
    task_id: this.getNextAvailableId(),
    deliverable_id: '',
    task_type_id: '',
    task_name: '',
    task_description: '',
    assignee_id: '',
    reviewer_id: '',
    priority: 'Medium',
    planned_start_date: '',
    planned_end_date: '',
    baseline_start_date: '',
    baseline_end_date: '',
    effort_estimated_in_hours: ''
  };

  editTaskModel: TaskUpdate = {
    business_unit_id: '',
    business_unit_name: '',
    business_unit_head_id: '',
    business_unit_head_name: '',
    project_id: '',
    project_name: '',
    delivery_manager_id: '',
    dleivery_manager_name: '',
    deliverable_id: '',
    deliverable_name: '',
    task_type_id: '',
    task_type_name: '',
    task_id: '',
    task_name: '',
    task_description: '',
    assignee_name: '',
    reviewer_name: '',
    priority: '',
    planned_start_date: '',
    planned_end_date: '',
    baseline_start_date: '',
    baseline_end_date: '',
    effort_estimated_in_hours: '',
    assignee_id: '',
    reviewer_id: ''
  };

  columns: (keyof Task)[] = [
    'business_unit_name',
    'project_name',
    'deliverable_name',
    'task_name',
    'task_type_name',
    'task_description',
    'assignee_name',
    'reviewer_name',
    'priority',
    'planned_start_date',
    'planned_end_date',
    'effort_estimated_in_hours',
    'updated_at',
    'updated_by_name'
  ];

  columnLabels: Record<string, string> = {
  business_unit_name: 'BU',
  project_name: 'Project',
  deliverable_name: 'Deliverable',
  task_name: 'Task',
  task_type_name: 'Task Type',
  task_description: 'Task Description',
  assignee_name: 'Assignee',
  reviewer_name: 'Reviewer',
  priority: 'Priority',
  planned_start_date: 'Planned Start Date',
  planned_end_date: 'Planned End Date',
  effort_estimated_in_hours: 'Estimated Effort (hrs)',
  updated_at: 'Updated At',
  updated_by_name: 'Updated By'
};



  activeFilter: keyof Task | null = null;
  selectedFilters: Partial<Record<keyof Task, string[]>> = {};

  ngOnInit(): void {
    this.ds.fetchTasks().subscribe();
    this.ds.fetchDeliverables().subscribe();
    this.ds.fetchEmployees().subscribe();
    this.ds.fetchBU().subscribe();
    this.ds.fetchProjects().subscribe();
  }

  applyDefaultFilters(): void {
    const user = this.auth.getAuthenticatedUser();
    if (user && user.employee_full_name) {
      this.selectedFilters['assignee_name'] = [user.employee_full_name];
    }
    
    console.log('Applied default filters for Task:', this.selectedFilters);
    console.log('User details:', user);
  }


  get filteredTasks(): Task[] {
    let list = this.taskItems();
    for (const key in this.selectedFilters) {
      const k = key as keyof Task;
      const values = this.selectedFilters[k];
      if (values && values.length) {
        list = list.filter((t) => values.includes(t[k]!));
      }
    }
    return list;
  }

  getNextAvailableId(): string {
     const alltasks = this.taskItems(); 
     if (!alltasks) return '101'; 
     const ids = alltasks
      .map(e => Number(e.task_id))
      .filter(n => !isNaN(n)); 
    return (Math.max(...ids) + 1).toString();
}
  
  toggleFilter(column: keyof Task) {
    this.activeFilter = this.activeFilter === column ? null : column;
  }

  getUniqueOptions(column: keyof Task): string[] {
    const values = this.taskItems().map((t) => t[column] || '');
    return Array.from(new Set(values));
  }

  isSelected(column: keyof Task, value: string): boolean {
    return this.selectedFilters[column]?.includes(value) ?? false;
  }

  toggleSelection(column: keyof Task, value: string) {
    if (!this.selectedFilters[column]) this.selectedFilters[column] = [];
    const idx = this.selectedFilters[column]!.indexOf(value);
    if (idx > -1) this.selectedFilters[column]!.splice(idx, 1);
    else this.selectedFilters[column]!.push(value);
    this.activeFilter = null;
  }

  clearAllFilters() {
    this.selectedFilters = {};
  }

  clearFilter(column: keyof Task, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFilters[column] = [];
    this.activeFilter = null;
  }

  hasFilter(column: keyof Task): boolean {
    return (this.selectedFilters[column]?.length ?? 0) > 0;
  }

  getFilterCount(column: keyof Task): number {
    return this.selectedFilters[column]?.length ?? 0;
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.newTask = {
      task_id: this.getNextAvailableId(),
      deliverable_id: '',
      task_type_id: '',
      task_name: '',
      task_description: '',
      assignee_id: '',
      reviewer_id: '',
      priority: 'Medium',
      planned_start_date: '',
      planned_end_date: '',
      baseline_start_date: '',
      baseline_end_date: '',
      effort_estimated_in_hours: ''
    };
  }

  saveNewTask(): void {
    this.newTask.baseline_start_date = this.newTask.planned_start_date;
    this.newTask.baseline_end_date = this.newTask.planned_end_date;
    this.ds.createTask(this.newTask).subscribe({
      next: () => this.cancelForms(),
      error: (err) => console.error('Creation failed:', err)
    });
  }

  openEditForm(task: Task): void {
    this.showEditForm = true;
    this.showCreateForm = false;
    this.editingTaskId = task.task_id;
    this.editTaskModel = {
      business_unit_id: task.business_unit_id,
      business_unit_name: task.business_unit_name,
      business_unit_head_id: task.business_unit_head_id,
      business_unit_head_name: task.business_unit_head_name,
      project_id: task.project_id,
      project_name: task.project_name,
      delivery_manager_id: task.delivery_manager_id,
      dleivery_manager_name: task.delivery_manager_name,
      deliverable_id: task.deliverable_id,
      deliverable_name: task.deliverable_name,
      task_type_id: task.task_type_id,
      task_type_name: task.task_type_name,
      task_id: task.task_id,
      task_name: task.task_name,
      task_description: task.task_description,
      assignee_name: task.assignee_name,
      reviewer_name: task.reviewer_name,
      priority: task.priority,
      planned_start_date: task.planned_start_date,
      planned_end_date: task.planned_end_date,
      baseline_start_date: task.baseline_start_date,
      baseline_end_date: task.baseline_end_date,
      effort_estimated_in_hours: task.effort_estimated_in_hours,
      assignee_id: task.assignee_id,
      reviewer_id: task.reviewer_id,
    };
  }

  saveEditTask(): void {
    if (!this.editingTaskId) return;

    this.ds.updateTask(this.editingTaskId, this.editTaskModel).subscribe({
      next: () => {this.cancelForms()},
      error: (err) => console.error('Update failed:', err)
    });
  }

  openDeletePopup(task: Task): void {
    this.selectedTask = task;
    this.showDeletePopup = true;
  }

  confirmDelete(): void {
    if (this.selectedTask?.task_id) {
      this.ds.deleteTask(this.selectedTask.task_id).subscribe({
        next: () => this.cancelForms(),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  cancelForms(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showDeletePopup = false;
    this.selectedTask = null;
    this.editingTaskId = null;
  }
}
