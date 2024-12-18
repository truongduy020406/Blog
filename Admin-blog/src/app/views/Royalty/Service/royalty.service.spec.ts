import { TestBed } from '@angular/core/testing';

import { RoyaltyService } from './royalty.service';

describe('RoyaltyService', () => {
  let service: RoyaltyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoyaltyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
