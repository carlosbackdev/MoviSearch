import { TestBed } from '@angular/core/testing';

import { YtsService } from './yts.service';

describe('YtsService', () => {
  let service: YtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YtsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
