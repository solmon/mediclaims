import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCareEventDetailsComponent } from './health-care-event-details.component';

describe('HealthCareEventDetailsComponent', () => {
  let component: HealthCareEventDetailsComponent;
  let fixture: ComponentFixture<HealthCareEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthCareEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCareEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
