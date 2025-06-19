import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authLoginRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)

  if (authService.hasToken()) {
    return false
  }

  return true
}
