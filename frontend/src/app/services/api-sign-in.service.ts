import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { skipAuth } from '../core/http/skip-auth'

@Injectable({
  providedIn: 'root',
})
export class ApiSignInService {
  private readonly _http = inject(HttpClient)

  public signIn(username: string, password: string) {
    return this._http.post(
      '/api/login',
      {
        username,
        password,
      },
      skipAuth()
    )
  }
}
