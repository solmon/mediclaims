import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateUserComponent } from './validate-user.component';

describe('SigninComponent', () => {
  let component: ValidateUserComponent;
  let fixture: ComponentFixture<ValidateUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
