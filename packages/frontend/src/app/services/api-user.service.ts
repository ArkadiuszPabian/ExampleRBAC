import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { DTOEditUser } from '../models/dto-edit-user.model'
import { DTOUser } from '../models/dto-user.model'

@Injectable({
  providedIn: 'root',
})
export class ApiUserService {
  private readonly _http = inject(HttpClient)

  public getSingleUser(id: number) {
    return this._http.get<DTOEditUser>(`${environment.apiUrl}/users/${id}`)
  }

  public getUsers() {
    return this._http.get<DTOUser[]>(`${environment.apiUrl}/users`)
  }

  public createUser(user: DTOEditUser) {
    return this._http.post(`${environment.apiUrl}/users`, user)
  }

  public updateUser(id: number, user: DTOEditUser) {
    return this._http.put(`${environment.apiUrl}/users/${id}`, user)
  }

  public deleteUser(id: number) {
    return this._http.delete(`${environment.apiUrl}/users/${id}`)
  }
}
