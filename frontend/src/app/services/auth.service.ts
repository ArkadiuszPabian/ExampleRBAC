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
import { ApiMeService } from './api-me.service'
import { ApiSignInService } from './api-sign-in.service'
import { MeService } from './me.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _apiSignInService = inject(ApiSignInService)
  private readonly _apiMeService = inject(ApiMeService)
  private readonly _authState$ = new BehaviorSubject<boolean>(false)
  private readonly _meService = inject(MeService)
  private readonly _router = inject(Router)

  public login(username: string, password: string) {
    return this._apiSignInService.signIn(username, password).pipe(
      switchMap(() => {
        this._authState$.next(true)
        return this._apiMeService.getMyInfo()
      }),
      tap((myInfo) => {
        console.log({ myInfo })
        this._meService.set(myInfo)
        return myInfo
      }),
      catchError((err) => {
        console.error({ err })
        this.logout()
        this._meService.set(undefined)
        return of(err.error?.reason ?? err.statusText)
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
  }
}
