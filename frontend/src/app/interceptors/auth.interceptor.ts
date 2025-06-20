import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthService } from '../services/auth.service'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  const token = authService.getToken()

  if (
    token &&
    !req.url.startsWith('/api/login') &&
    !(req.method === 'get' && req.url.startsWith('/api/articles'))
  ) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    return next(authReq)
  }

  const credentialsReq = req.clone({
    withCredentials: true,
  })
  return next(credentialsReq)
}
