import { TestBed } from '@angular/core/testing';

import { DailyInflowService } from './daily-inflow.service';

describe('DailyInflowService', () => {
  let service: DailyInflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyInflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
