import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, of, throwError } from 'rxjs'
import { AuthService } from '../services/auth.service'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  const authReq = req.clone({
    withCredentials: true,
  })
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout()
        return of()
      }
      return throwError(() => error)
    })
  )
}
