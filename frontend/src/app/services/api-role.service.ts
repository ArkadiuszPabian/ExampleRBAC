import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { DTOUser } from '../models/dto-user.model'

@Injectable({
  providedIn: 'root',
})
export class ApiRoleService {
  private readonly _http = inject(HttpClient)

  public getRoles() {
    return this._http.get<DTOUser[]>('/api/roles')
  }
}
