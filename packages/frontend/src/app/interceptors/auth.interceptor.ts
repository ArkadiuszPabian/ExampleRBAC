import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, EMPTY, Observable, switchMap } from 'rxjs'
import { AccessTokenStorageService } from '../services/access-token-storage.service'
import { ApiAuthService } from '../services/api-auth.service'
import { AuthService } from '../services/auth.service'

const refreshHeaderName = 'X-Refreshed'

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService)
  const tokenStorage = inject(AccessTokenStorageService)
  const apiAuthService = inject(ApiAuthService)

  const accessToken = tokenStorage.get()
  let authReq = req.clone({ withCredentials: true })

  if (accessToken) {
    authReq = authReq.clone({
      headers: authReq.headers.set('Authorization', `Bearer ${accessToken}`),
    })
  }

  return next(authReq).pipe(
    catchError((error: Error) => {
      tokenStorage.store(undefined)
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const hasRefreshedHeader = error.headers.has(refreshHeaderName)

        if (!hasRefreshedHeader) {
          return apiAuthService.rotateRefreshToken().pipe(
            switchMap((response) => {
              tokenStorage.store(response.accessToken)
              const refreshReq = req.clone({
                headers: req.headers.set(
                  'Authorization',
                  `Bearer ${tokenStorage.get()}`
                ),
                withCredentials: true,
              })

              return next(refreshReq)
            })
          )
        }
      }

      return authService.logout().pipe(switchMap(() => EMPTY))
    })
  )
}
