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
      },
      { withCredentials: true }
    )
  }

  public signOut() {
    return this._http.post<null>(
      `${environment.apiUrl}/auth/logout`,
      {},
      { withCredentials: true }
    )
  }

  public rotateRefreshToken() {
    return this._http.post<{ accessToken: string }>(
      `${environment.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    )
  }

  public status() {
    return this._http.head<null>(`${environment.apiUrl}/auth/status`, {
      withCredentials: true,
    })
  }
}
