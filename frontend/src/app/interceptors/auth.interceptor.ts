import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, of, throwError } from 'rxjs'
import { SKIP_AUTH } from '../core/http/auth-context-token'
import { AuthService } from '../services/auth.service'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  const token = authService.getToken()

  const skip = req.context.get(SKIP_AUTH)
  if (skip || !token) {
    return next(req.clone({ withCredentials: true })).pipe(
      catchError((err) => handleError(err, authService))
    )
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
  return next(authReq).pipe(catchError((err) => handleError(err, authService)))
}

const handleError = (error: HttpErrorResponse, authService: AuthService) => {
  if (error.status === 401) {
    authService.logout()
    return of()
  }
  return throwError(() => error)
}
