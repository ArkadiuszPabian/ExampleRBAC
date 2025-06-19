import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  if (req.url.startsWith('/api/login')) {
    const loginReq = req.clone({
      withCredentials: true
    })
    return next(loginReq)
  }

  const token = authService.getToken()

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
    return next(authReq)
  }

  return next(req)
}
