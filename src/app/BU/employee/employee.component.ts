import { Component, OnInit, inject, Signal } from '@angular/core';
import { DataService } from "../../data.service";
import { AuthService } from 'src/app/auth/auth.service';
import { Employee, EmployeeCreate, EmployeeUpdate } from "../../model/Employee";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  private ds = inject(DataService);
  private auth = inject(AuthService);

  // --- Signals from DataService ---
  employees: Signal<Employee[]> = this.ds.employees;
  loading: Signal<boolean> = this.ds.employeeLoading;
  error: Signal<string | null> = this.ds.employeeError;
  businessUnits: Signal<any[]> = this.ds.bu; // Assuming BU type

  showingMyBUEmployees = false;
  myBUFilteredList: Employee[] = [];

  getMyBUEmployees(): void {
  const user = this.auth.getAuthenticatedUser();
  const myBU = user.business_unit_id;

  if (!myBU) {
    alert('No Business Unit found for this user.');
    return;
  }

  const allEmployees = this.employees();
  this.myBUFilteredList = allEmployees.filter(
    emp => emp.business_unit_id === myBU
  );

  this.showingMyBUEmployees = true;
}
  showAllEmployees(): void {
  this.showingMyBUEmployees = false;
}

  // --- UI State ---
  showCreateForm = false;
  showEditForm = false;
  showDeletePopup = false;
  selectedEmployee: Employee | null = null;

  editingEmployeeId: string | null = null;

  // --- Form Models ---
  newEmployee: EmployeeCreate = {
    employee_id: '',
    employee_full_name: '',
    employee_email_address: '',
    password: '',
    business_unit_id: ''
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

  // --- Column headers & filters ---
  columns: (keyof Employee)[] = [
    'business_unit_name',
    'business_unit_head_name',
    'employee_full_name',
    'employee_email_address',
    'created_at',
    'created_by_name',
    'updated_at',
    'updated_by_name'
  ];

  columnLabels: Record<string, string> = {
  business_unit_name: 'BU',
  business_unit_head_name: 'BU Head',
  employee_full_name: 'Employee',
  employee_email_address: 'Employee Email',
  created_at: 'Created At',
  created_by_name: 'Created By',
  updated_at: 'Updated At',
  updated_by_name: 'Updated By'
};


  activeFilter: keyof Employee | null = null;
  selectedFilters: Partial<Record<keyof Employee, string[]>> = {};

  ngOnInit(): void {
    this.ds.fetchBU().subscribe();
    this.ds.fetchEmployees().subscribe(() => {
      // this.applyDefaultFilters();
    });
  }

  applyDefaultFilters(): void {
    const user = this.auth.getAuthenticatedUser();
    if (user) {
      // Apply default filter for Employee column based on user's full name
      if (user.employee_full_name) {
        this.selectedFilters['employee_full_name'] = [user.employee_full_name];
      }
    }

    console.log('Applied default filters:', this.selectedFilters);
    console.log('User details:', user);
  }

  // --- Filtered list ---
  get filteredEmployees(): Employee[] {
  let list = this.showingMyBUEmployees ? this.myBUFilteredList : this.employees();

  for (const key in this.selectedFilters) {
    const k = key as keyof Employee;
    const values = this.selectedFilters[k];
    if (values && values.length) {
      list = list.filter(emp => values.includes(emp[k]!));
    }
  }

  return list;
}


  // --- Filter helpers ---
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

    // Close the filter dropdown after selection
    this.activeFilter = null;
  }

  clearAllFilters() {
    this.selectedFilters = {};
  }

  clearColumnFilter(column: keyof Employee, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFilters[column] = [];
    this.activeFilter = null;
  }

  hasFilter(column: keyof Employee): boolean {
    return !!(this.selectedFilters[column] && this.selectedFilters[column]!.length > 0);
  }

  getFilterCount(column: keyof Employee): number {
    return this.selectedFilters[column]?.length || 0;
  }

  get hasActiveFilters(): boolean {
    return Object.keys(this.selectedFilters).some(
      k => this.selectedFilters[k as keyof Employee]?.length
    );
  }

  // --- CRUD Methods ---
  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.newEmployee = {
      employee_id: '',
      employee_full_name: '',
      employee_email_address: '',
      password: '',
      business_unit_id: ''
    };
  }

  saveNewEmployee(): void {
    this.ds.createEmployee(this.newEmployee).subscribe({
      next: () => this.cancelForms(),
      error: err => console.error('Creation failed:', err)
    });
  }

  openEditForm(emp: Employee): void {
    this.showEditForm = true;
    this.showCreateForm = false;
    this.editingEmployeeId = emp.employee_id;
    this.editEmployeeModel = {
      employee_id: emp.employee_id,
      employee_full_name: emp.employee_full_name,
      employee_email_address: emp.employee_email_address,
      business_unit_id: emp.business_unit_id,
      business_unit_name: emp.business_unit_name,
      business_unit_head_id: emp.business_unit_head_id,
      business_unit_head_name: emp.business_unit_head_name
    };
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
