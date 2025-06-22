import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { DtoMeModel } from '../models/dto-me.model'

@Injectable({
  providedIn: 'root',
})
export class ApiMeService {
  private readonly _http = inject(HttpClient)

  public getMyInfo() {
    return this._http.get<DtoMeModel>(`/api/me`)
  }
}
