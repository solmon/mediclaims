import { TestBed, inject } from '@angular/core/testing';

import { HealthCareEventService } from './health-care-event.service';

describe('HealthCareEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HealthCareEventService]
    });
  });

  it('should be created', inject([HealthCareEventService], (service: HealthCareEventService) => {
    expect(service).toBeTruthy();
  }));
});
