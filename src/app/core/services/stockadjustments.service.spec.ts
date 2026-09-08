import { TestBed } from '@angular/core/testing';

import { StockadjustmentsService } from './stockadjustments.service';

describe('StockadjustmentsService', () => {
  let service: StockadjustmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockadjustmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
