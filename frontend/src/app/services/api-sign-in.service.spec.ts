import { TestBed } from '@angular/core/testing';

import { ApiSignInService } from './api-sign-in.service';

describe('ApiSignInService', () => {
  let service: ApiSignInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSignInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
