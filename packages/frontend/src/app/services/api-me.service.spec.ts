import { TestBed } from '@angular/core/testing';

import { ApiMeService } from './api-me.service';

describe('ApiMeService', () => {
  let service: ApiMeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
