import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class AccessTokenStorageService {
  private _accessToken: string | undefined

  public store(accessToken: string | undefined): void {
    this._accessToken = accessToken
  }

  public get(): string | undefined {
    return this._accessToken
  }
}
