import { TestBed, inject } from '@angular/core/testing';

import { CoachingService } from './coaching.service';

describe('CoachingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoachingService]
    });
  });

  it('should be created', inject([CoachingService], (service: CoachingService) => {
    expect(service).toBeTruthy();
  }));
});
