import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCareEventDashboardComponent } from './health-care-event-dashboard.component';

describe('HealthCareEventDashboardComponent', () => {
  let component: HealthCareEventDashboardComponent;
  let fixture: ComponentFixture<HealthCareEventDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthCareEventDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCareEventDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
