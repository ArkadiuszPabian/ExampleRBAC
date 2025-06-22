import { TestBed } from '@angular/core/testing';

import { PermissionRefresherService } from './permission-refresher.service';

describe('PermissionRefresherService', () => {
  let service: PermissionRefresherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionRefresherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
