import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUnitComponent } from './business_unit.component';

describe('BusinessunitComponent', () => {
  let component: BusinessUnitComponent;
  let fixture: ComponentFixture<BusinessUnitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessUnitComponent]
    });
    fixture = TestBed.createComponent(BusinessUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
