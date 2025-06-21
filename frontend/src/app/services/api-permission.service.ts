import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { DTOPermission } from '../models/dto-permission.model'

@Injectable({
  providedIn: 'root',
})
export class ApiPermissionService {
  private readonly _http = inject(HttpClient)

  public getPermissions(roleId: number) {
    return this._http.get<DTOPermission[]>(`/api/permissions/${roleId}`)
  }
}
