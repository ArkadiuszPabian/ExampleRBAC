import { TestBed } from '@angular/core/testing'
import { CanActivateFn } from '@angular/router'

import { authLoginRedirectGuard } from './auth-login-redirect.guard'

describe('authLoginRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      authLoginRedirectGuard(...guardParameters)
    )

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })
})
