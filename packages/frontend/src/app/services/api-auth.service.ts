import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService {
  private readonly _http = inject(HttpClient)

  public signIn(username: string, password: string) {
    return this._http.post<{ accessToken: string }>(
      `${environment.apiUrl}/auth/login`,
      {
        username,
        password,
      }
    )
  }

  public signOut() {
    return this._http.post<never>(`${environment.apiUrl}/auth/logout`, {})
  }

  public rotateRefreshToken() {
    return this._http.post<{ accessToken: string }>(
      `${environment.apiUrl}/auth/refresh`,
      {}
    )
  }
}
