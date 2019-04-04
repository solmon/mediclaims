import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCareEventComponent } from './health-care-event.component';

describe('HealthCareEventComponent', () => {
  let component: HealthCareEventComponent;
  let fixture: ComponentFixture<HealthCareEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthCareEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCareEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
