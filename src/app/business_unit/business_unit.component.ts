import { Component, OnInit, inject, Signal } from '@angular/core';
import { DataService } from '../data.service';
import { BusinessUnit, BusinessUnitCreate, BusinessUnitUpdate } from '../model/business_unit';
import { Employee } from 'src/app/model/employee';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-businessunit',
  templateUrl: './business_unit.component.html',
  styleUrls: ['./business_unit.component.scss'],
})
export class BusinessUnitComponent implements OnInit {
  private ds = inject(DataService);
  private auth = inject(AuthService);

  buItems: Signal<BusinessUnit[]> = this.ds.bu;
  buLoading: Signal<boolean> = this.ds.buLoading;
  buError: Signal<string | null> = this.ds.buError;
  employees: Signal<Employee[]> = this.ds.employees;

  showCreateForm = false;
  showEditForm = false;
  showDeletePopup = false;

  selectedBU: BusinessUnit | null = null;

  private nextBUId = 101;

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

  columns: (keyof BusinessUnit)[] = [
    'business_unit_name',
    'business_unit_head_name',
    'business_unit_description',
    'updated_at',
    'updated_by_name',
  ];

  columnLabels: Record<string, string> = {
  business_unit_name: 'BU',
  business_unit_head_name: 'BU Head',
  business_unit_description: 'Description',
  updated_at: 'Updated At',
  updated_by_name: 'Updated By'
};

  activeFilter: keyof BusinessUnit | null = null;
  selectedFilters: Partial<Record<keyof BusinessUnit, string[]>> = {};

  ngOnInit(): void {
    this.ds.fetchBU().subscribe();
    this.ds.fetchEmployees().subscribe();
  }

  applyDefaultFilters(): void {
    const user = this.auth.getAuthenticatedUser();
    if (user && user.employee_full_name) {
      this.selectedFilters['business_unit_head_name'] = [user.employee_full_name];
    }
  }

  get filteredBUs(): BusinessUnit[] {
    let list = this.buItems();
    for (const key in this.selectedFilters) {
      const k = key as keyof BusinessUnit;
      const values = this.selectedFilters[k];
      if (values && values.length) {
        list = list.filter((bu) => values.includes(bu[k]!));
      }
    }
    return list;
  }

  toggleFilter(column: keyof BusinessUnit) {
    this.activeFilter = this.activeFilter === column ? null : column;
  }

  getUniqueOptions(column: keyof BusinessUnit): string[] {
    const values = this.buItems().map((bu) => bu[column] || '');
    return Array.from(new Set(values));
  }

  isSelected(column: keyof BusinessUnit, value: string): boolean {
    return this.selectedFilters[column]?.includes(value) ?? false;
  }

  toggleSelection(column: keyof BusinessUnit, value: string) {
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

  clearFilter(column: keyof BusinessUnit, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedFilters[column] = [];
    this.activeFilter = null;
  }

  hasFilter(column: keyof BusinessUnit): boolean {
    return !!(this.selectedFilters[column] && this.selectedFilters[column]!.length > 0);
  }

  getFilterCount(column: keyof BusinessUnit): number {
    return this.selectedFilters[column]?.length || 0;
  }

  get hasActiveFilters(): boolean {
    return Object.keys(this.selectedFilters).some(
      (k) => this.selectedFilters[k as keyof BusinessUnit]?.length
    );
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.showEditForm = false;
    this.newBU = {
      business_unit_id: this.getNextAvailableId(),
      business_unit_name: '',
      business_unit_description: '',
      business_unit_head_id: '',
    };
  }

  getNextAvailableId(): string {
    const allBUs = this.buItems(); 
    if (!allBUs.length) return '101'; 
    const ids = allBUs
      .map(e => Number(e.business_unit_id))
      .filter(n => !isNaN(n)); 
    return (Math.max(...ids) + 1).toString();
}

saveNewBU(): void {
    this.ds.createBU(this.newBU).subscribe({
      next: () => this.cancelForms(),
      error: (err) => console.error('Creation failed:', err),
    });
  }

 
openEditForm(bu: BusinessUnit): void {
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

  openDeletePopup(bu: BusinessUnit): void {
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
  
  cancelForms(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showDeletePopup = false;
    this.selectedBU = null;
    this.editingBUId = null;
  }
}
