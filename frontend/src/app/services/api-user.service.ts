import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DTOEditUser } from '../models/dto-edit-user.model';
import { DTOUser } from '../models/dto-user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {
  private readonly _http = inject(HttpClient)

  public getUsers() {
    return this._http.get<DTOUser[]>('/api/users')
  }

  public createUser(user: DTOEditUser) {
    return this._http.post('/api/users', user)
  }

  public updateUser(id: number, user: DTOEditUser) {
    return this._http.put(`/api/users/${id}`, user)
  }

  public deleteUser(id: number) {
    return this._http.delete(`/api/users/${id}`)
  }
}
