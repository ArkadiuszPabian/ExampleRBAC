import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { DTOEditRole } from '../models/dto-edit-role.model'
import { DTORole } from '../models/dto-role.model'

@Injectable({
  providedIn: 'root',
})
export class ApiRoleService {
  private readonly _http = inject(HttpClient)

  public getSingleRole(id: number) {
    return this._http.get<DTORole>(`/api/roles/${id}`)
  }

  public getRoles() {
    return this._http.get<DTORole[]>('/api/roles')
  }

  public createRole(role: DTOEditRole) {
    return this._http.post('/api/roles', role)
  }

  public updateRole(id: number, role: DTOEditRole) {
    return this._http.put(`/api/roles/${id}`, role)
  }

  public deleteRole(id: number) {
    return this._http.delete(`/api/roles/${id}`)
  }
}
