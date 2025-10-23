import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessunitComponent } from './businessunit.component';

describe('BusinessunitComponent', () => {
  let component: BusinessunitComponent;
  let fixture: ComponentFixture<BusinessunitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessunitComponent]
    });
    fixture = TestBed.createComponent(BusinessunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
