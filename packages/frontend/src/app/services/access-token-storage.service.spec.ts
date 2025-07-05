import { TestBed } from '@angular/core/testing';

import { AccessTokenStorageService } from './access-token-storage.service';

describe('AccessTokenStorageService', () => {
  let service: AccessTokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessTokenStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
