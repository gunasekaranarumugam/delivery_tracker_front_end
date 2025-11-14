import { ComponentFixture, TestBed } from '@angular/core/testing';

// 1. Update the import to match the correct component name
import { EmployeeComponent } from './employee.component';

// 2. Update the describe block description
describe('EmployeeComponent', () => {
  // 3. Update the component variable type and declaration
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // 4. Update the component in declarations
      declarations: [EmployeeComponent]
    });
    // 5. Update component creation
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the EmployeeComponent', () => {
    expect(component).toBeTruthy();
  });
});