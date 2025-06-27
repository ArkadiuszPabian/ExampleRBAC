import { TestBed } from '@angular/core/testing'
import { CanActivateFn } from '@angular/router'
import { permissionRedirectGuard } from './permission-redirect.guard'
import { Permission } from '../models/permission.model'

describe('permissionRedirectGuard', () => {
  const executeGuard = (
    permission: Permission,
    ...guardParameters: Parameters<CanActivateFn>
  ) => {
    return TestBed.runInInjectionContext(() => {
      const guardFn = permissionRedirectGuard(permission)
      return guardFn(...guardParameters)
    })
  }

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })
})
