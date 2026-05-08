import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { Observable, shareReplay, tap } from 'rxjs'
import { DTOEditRole } from '../models/dto-edit-role.model'
import { DTORole } from '../models/dto-role.model'

@Injectable({
  providedIn: 'root',
})
export class ApiRoleService {
  private readonly _http = inject(HttpClient)
  private _roles$?: Observable<DTORole[]>

  public getSingleRole(id: number) {
    return this._http.get<DTORole>(`${environment.apiUrl}/roles/${id}`)
  }

  public getRoles() {
    if (!this._roles$) {
      this._roles$ = this._http
        .get<DTORole[]>(`${environment.apiUrl}/roles`)
        .pipe(shareReplay(1))
    }
    return this._roles$
  }

  public createRole(role: DTOEditRole) {
    return this._http.post(`${environment.apiUrl}/roles`, role).pipe(
      tap(() => {
        this._roles$ = undefined
      })
    )
  }

  public updateRole(id: number, role: DTOEditRole) {
    return this._http.put(`${environment.apiUrl}/roles/${id}`, role).pipe(
      tap(() => {
        this._roles$ = undefined
      })
    )
  }

  public deleteRole(id: number) {
    return this._http.delete(`${environment.apiUrl}/roles/${id}`).pipe(
      tap(() => {
        this._roles$ = undefined
      })
    )
  }
}
