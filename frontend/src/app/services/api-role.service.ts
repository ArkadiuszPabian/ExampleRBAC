import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { DTORole } from '../models/dto-role.model'

@Injectable({
  providedIn: 'root',
})
export class ApiRoleService {
  private readonly _http = inject(HttpClient)

  public getRoles() {
    return this._http.get<DTORole[]>('/api/roles')
  }
}
