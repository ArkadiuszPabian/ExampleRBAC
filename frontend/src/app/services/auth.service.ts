import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { JWTPayload } from '../models/jwt-payload.model';
import { Permission } from '../models/permission.model';
import { ApiSignInService } from './api-sign-in.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _cookieService = inject(CookieService)
  private readonly _apiSignInService = inject(ApiSignInService)
  private readonly _authState$ = new BehaviorSubject<boolean>(false)
  private readonly _tokenCookieName = 'access_token'
  private _router = inject(Router)

  public initialize(): void {
    this._authState$.next(this.hasToken())
  }

  public login(
    username: string,
    password: string
  ) {
    return this._apiSignInService.signIn(
      username,
      password
    ).pipe(
      map(() => {
        console.debug('Setting authState$ value to true')
        this._authState$.next(true)
        return true
      }),
      catchError(err => {
        console.debug({err})
        this.logout()
        return of(err.error?.reason ?? err.statusText)
      })
    );
  }

  public isLoggedIn$(): Observable<boolean> {
    return this._authState$.asObservable()
  }

  public hasToken(): boolean {
    return this._cookieService.check(this._tokenCookieName)
  }

  public getToken(): string {
    return this._cookieService.get(this._tokenCookieName)
  }

  public deleteToken(): void {
    this._cookieService.delete(this._tokenCookieName)
  }

  public hasPermission(permission: Permission): boolean {
    const token = this.getToken()
    if (!token) {
      return false
    }

    try {
      const decodedToken = jwtDecode<JWTPayload>(token)
      return decodedToken.permissions?.includes(permission) ?? false
    } catch {
      return false
    }
  }

  public getUserId(): number | undefined {
    const token = this.getToken()
    if (!token) {
      return undefined
    }

    try {
      const decodedToken = jwtDecode<JWTPayload>(token)
      return decodedToken.sub
    } catch {
      return undefined
    }
  }

  public logout() {
    this.deleteToken()
    console.debug('Setting authState$ value to false')
    this._authState$.next(false)
    this._router.navigate(['sign-in'])
  }
}
