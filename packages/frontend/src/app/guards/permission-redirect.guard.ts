import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'
import { Permission } from '../models/permission.model'
import { AuthService } from '../services/auth.service'
import { map } from 'rxjs'

export const permissionRedirectGuard = (
  permission: Permission
): CanActivateFn => {
  return (_route, _state) => {
    const authService = inject(AuthService)

    if (!authService.isLoggedIn()) {
      return authService.logout().pipe(map(() => false))
    }

    return authService.hasPermission(permission)
  }
}
