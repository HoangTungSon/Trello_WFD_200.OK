import { TestBed } from '@angular/core/testing';

import { ListCardService } from './list-card.service';

describe('ListCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListCardService = TestBed.get(ListCardService);
    expect(service).toBeTruthy();
  });
});
