import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs'
import { Permission } from '../models/permission.model'
import { AccessTokenStorageService } from './access-token-storage.service'
import { ApiAuthService } from './api-auth.service'
import { ApiMeService } from './api-me.service'
import { MeService } from './me.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _apiAuthService = inject(ApiAuthService)
  private readonly _apiMeService = inject(ApiMeService)
  private readonly _accessTokenStorageService = inject(
    AccessTokenStorageService
  )
  private readonly _authState$ = new BehaviorSubject<boolean>(false)
  private readonly _meService = inject(MeService)
  private readonly _router = inject(Router)

  public restoreSession() {
    return this._apiAuthService.rotateRefreshToken().pipe(
      switchMap((response) => {
        this._accessTokenStorageService.store(response.accessToken)
        this._authState$.next(true)
        return this._apiMeService.getMyInfo()
      }),
      tap((myInfo) => {
        this._meService.set(myInfo)
      }),
      switchMap(() => of(true)),
      catchError(() => {
        this._accessTokenStorageService.store(undefined)
        this._meService.set(undefined)
        this._authState$.next(false)
        return of(false)
      })
    )
  }

  public login(username: string, password: string) {
    return this._apiAuthService.signIn(username, password).pipe(
      switchMap((response) => {
        this._accessTokenStorageService.store(response.accessToken)
        this._authState$.next(true)
        return this._apiMeService.getMyInfo()
      }),
      tap((myInfo) => {
        this._meService.set(myInfo)
        return myInfo
      }),
      catchError((err) => {
        this._meService.set(undefined)
        return this.logout().pipe(
          switchMap(() => {
            return of(err.error?.reason ?? err.statusText)
          })
        )
      })
    )
  }

  public isLoggedIn$(): Observable<boolean> {
    return this._authState$.asObservable()
  }

  public isLoggedIn(): boolean {
    return this._authState$.value
  }

  public hasPermission(permission: Permission): boolean {
    return this._meService.me?.permissions.includes(permission) ?? false
  }

  public getUserId(): number | undefined {
    return this._meService.me?.id
  }

  public getLoggedUser(): string | undefined {
    return this._meService.me?.name
  }

  public logout() {
    this._meService.set(undefined)
    this._authState$.next(false)
    this._router.navigate(['sign-in'])
    return this._apiAuthService.signOut()
  }
}
