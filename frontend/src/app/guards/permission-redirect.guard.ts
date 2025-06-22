import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'
import { Permission } from '../models/permission.model'
import { AuthService } from '../services/auth.service'

export const permissionRedirectGuard = (
  permission: Permission
): CanActivateFn => {
  return (_route, _state) => {
    const authService = inject(AuthService)

    if (!authService.hasToken()) {
      authService.logout()
      return false
    }

    return authService.hasPermission(permission)
  }
}
