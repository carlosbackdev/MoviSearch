import { TestBed } from '@angular/core/testing';

import { CommentHttpService } from './comment-http.service';

describe('CommentHttpService', () => {
  let service: CommentHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
