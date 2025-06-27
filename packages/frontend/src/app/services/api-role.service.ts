import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { DTOEditRole } from '../models/dto-edit-role.model'
import { DTORole } from '../models/dto-role.model'

@Injectable({
  providedIn: 'root',
})
export class ApiRoleService {
  private readonly _http = inject(HttpClient)

  public getSingleRole(id: number) {
    return this._http.get<DTORole>(`${environment.apiUrl}/roles/${id}`)
  }

  public getRoles() {
    return this._http.get<DTORole[]>(`${environment.apiUrl}/roles`)
  }

  public createRole(role: DTOEditRole) {
    return this._http.post(`${environment.apiUrl}/roles`, role)
  }

  public updateRole(id: number, role: DTOEditRole) {
    return this._http.put(`${environment.apiUrl}/roles/${id}`, role)
  }

  public deleteRole(id: number) {
    return this._http.delete(`${environment.apiUrl}/roles/${id}`)
  }
}
