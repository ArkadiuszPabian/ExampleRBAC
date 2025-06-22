import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { tokenExpirationGuard } from './token-expiration.guard';

describe('tokenExpirationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => tokenExpirationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
