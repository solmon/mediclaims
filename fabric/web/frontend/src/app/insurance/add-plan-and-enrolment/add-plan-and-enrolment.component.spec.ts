import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanAndEnrolmentComponent } from './add-plan-and-enrolment.component';

describe('AddPlanAndEnrolmentComponent', () => {
  let component: AddPlanAndEnrolmentComponent;
  let fixture: ComponentFixture<AddPlanAndEnrolmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlanAndEnrolmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlanAndEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
