import { TestBed, inject } from '@angular/core/testing';

import { InsuranceServiceService } from './insurance-service.service';

describe('InsuranceServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InsuranceServiceService]
    });
  });

  it('should be created', inject([InsuranceServiceService], (service: InsuranceServiceService) => {
    expect(service).toBeTruthy();
  }));
});
