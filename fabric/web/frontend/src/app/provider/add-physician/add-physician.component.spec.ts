import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhysicianComponent } from './add-physician.component';

describe('AddPhysicianComponent', () => {
  let component: AddPhysicianComponent;
  let fixture: ComponentFixture<AddPhysicianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPhysicianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
