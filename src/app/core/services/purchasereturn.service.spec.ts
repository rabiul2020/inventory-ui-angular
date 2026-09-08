import { TestBed } from '@angular/core/testing';

import { PurchasereturnService } from './purchasereturn.service';

describe('PurchasereturnService', () => {
  let service: PurchasereturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasereturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
