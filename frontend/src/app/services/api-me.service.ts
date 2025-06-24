import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { DtoMeModel } from '../models/dto-me.model'

@Injectable({
  providedIn: 'root',
})
export class ApiMeService {
  private readonly _http = inject(HttpClient)

  public getMyInfo() {
    return this._http.get<DtoMeModel>(`${environment.apiUrl}/me`)
  }
}
