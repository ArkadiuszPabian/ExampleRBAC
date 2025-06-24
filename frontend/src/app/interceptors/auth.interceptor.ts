import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, throwError } from 'rxjs'
import { AuthService } from '../services/auth.service'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  const authReq = req.clone({
    withCredentials: true,
  })
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return authService.logout()
      }
      return throwError(() => error)
    })
  )
}
