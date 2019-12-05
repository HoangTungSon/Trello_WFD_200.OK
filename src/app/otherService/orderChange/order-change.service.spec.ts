import { TestBed } from '@angular/core/testing';

import { OrderChangeService } from './order-change.service';

describe('OrderChangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderChangeService = TestBed.get(OrderChangeService);
    expect(service).toBeTruthy();
  });
});
