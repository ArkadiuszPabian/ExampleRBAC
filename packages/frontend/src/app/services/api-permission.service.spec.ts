import { TestBed } from '@angular/core/testing';

import { ApiPermissionService } from './api-permission.service';

describe('ApiPermissionService', () => {
  let service: ApiPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
