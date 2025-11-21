import { Component, OnInit, inject, Signal } from '@angular/core';
import { DataService } from "../data.service";
import { AuthService } from 'src/app/auth/auth.service';
import { Employee, EmployeeCreate, EmployeeUpdate } from "../model/employee";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  private ds = inject(DataService);
  private auth = inject(AuthService);

  employees: Signal<Employee[]> = this.ds.employees;
  loading: Signal<boolean> = this.ds.employeeLoading;
  error: Signal<string | null> = this.ds.employeeError;
  businessUnits: Signal<any[]> = this.ds.bu;

  showingMyBUEmployees = false;
  myBUFilteredList: Employee[] = [];

  showCreateForm = false;
  showEditForm = false;
  showDeletePopup = false;
  selectedEmployee: Employee | null = null;
  editingEmployeeId: string | null = null;

  newEmployee: EmployeeCreate = {
    employee_id: '',
    employee_full_name: '',
    employee_email_address: '',
    password: '',
  };

  editEmployeeModel: EmployeeUpdate = {
    employee_id: '',
    employee_full_name: '',
    employee_email_address: '',
    business_unit_id: '',
    business_unit_name: '',
    business_unit_head_id: '',
    business_unit_head_name: ''
  };

  columns: (keyof Employee)[] = [
    'employee_full_name',
    'employee_email_address',
    'updated_at',
    'updated_by_name'
  ];

  columnLabels: Record<string, string> = {
    employee_full_name: 'Employee',
    employee_email_address: 'Employee Email',
    updated_at: 'Updated At',
    updated_by_name: 'Updated By'
  };

  activeFilter: keyof Employee | null = null;
  selectedFilters: Partial<Record<keyof Employee, string[]>> = {};

  ngOnInit(): void {
    this.ds.fetchBU().subscribe();
    this.ds.fetchEmployees().subscribe();
  }

 get filteredEmployees(): Employee[] {
    let list = this.employees();

    for (const key in this.selectedFilters) {
      const k = key as keyof Employee;
      const values = this.selectedFilters[k];
      if (values && values.length) {
        list = list.filter(emp => values.includes(emp[k]!));
      }
    }
    return list;
}

  toggleFilter(column: keyof Employee) {
    this.activeFilter = this.activeFilter === column ? null : column;
  }

  getUniqueOptions(column: keyof Employee): string[] {
    return Array.from(new Set(this.employees().map(emp => emp[column] || '')));
  }

  isSelected(column: keyof Employee, value: string): boolean {
    return this.selectedFilters[column]?.includes(value) ?? false;
  }

  toggleSelection(column: keyof Employee, value: string) {
    if (!this.selectedFilters[column]) this.selectedFilters[column] = [];
    const idx = this.selectedFilters[column]!.indexOf(value);
    if (idx > -1) this.selectedFilters[column]!.splice(idx, 1);
    else this.selectedFilters[column]!.push(value);

    this.activeFilter = null;
  }

  clearAllFilters() {
    this.selectedFilters = {};
  }

  clearColumnFilter(column: keyof Employee, event?: Event) {
    if (event) event.stopPropagation();
    this.selectedFilters[column] = [];
    this.activeFilter = null;
  }

  hasFilter(column: keyof Employee): boolean {
    return !!(this.selectedFilters[column]?.length);
  }

  getFilterCount(column: keyof Employee): number {
    return this.selectedFilters[column]?.length || 0;
  }

  get hasActiveFilters(): boolean {
    return Object.keys(this.selectedFilters).some(
      k => this.selectedFilters[k as keyof Employee]?.length
    );
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;

    this.newEmployee = {
      employee_id: this.getNextAvailableId(), 
      employee_full_name: '',
      employee_email_address: '',
      password: '',
    };
  }

  getNextAvailableId(): string {
    const allEmployees = this.employees(); 
    if (!allEmployees.length) return '101';
    const ids = allEmployees
      .map(e => Number(e.employee_id))
      .filter(n => !isNaN(n)); 
    return (Math.max(...ids) + 1).toString();
}

saveNewEmployee(): void {
  this.ds.createEmployee(this.newEmployee).subscribe({
    next: (createdEmployee: Employee) => {
      this.ds['_employees'].update(list => [...list, createdEmployee]);
      this.cancelForms();
    },
    error: err => {
      if (err.status === 409) {
        alert('Employee creation failed: Duplicate ID or constraint violation.');
      } else {
        console.error('Creation failed:', err);
      }
    }
  });
}

openEditForm(emp: Employee): void {
    this.showEditForm = true;
    this.showCreateForm = false;
    this.editingEmployeeId = emp.employee_id;

    this.editEmployeeModel = { ...emp };
  }

  saveEditEmployee(): void {
    if (!this.editingEmployeeId) return;
    this.ds.updateEmployee(this.editingEmployeeId, this.editEmployeeModel).subscribe({
      next: () => this.cancelForms(),
      error: err => console.error('Update failed:', err)
    });
  }

  openDeletePopup(emp: Employee): void {
    this.selectedEmployee = emp;
    this.showDeletePopup = true;
  }

  confirmDelete(): void {
    if (this.selectedEmployee?.employee_id) {
      this.ds.deleteEmployee(this.selectedEmployee.employee_id).subscribe({
        next: () => this.cancelForms(),
        error: err => console.error('Delete failed:', err)
      });
    }
  }

  cancelForms(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showDeletePopup = false;
    this.selectedEmployee = null;
    this.editingEmployeeId = null;
  }
}
