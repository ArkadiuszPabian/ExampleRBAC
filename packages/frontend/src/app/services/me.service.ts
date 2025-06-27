import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { DtoMeModel } from '../models/dto-me.model'

@Injectable({
  providedIn: 'root',
})
export class MeService {
  private readonly _meInfo$ = new BehaviorSubject<DtoMeModel | undefined>(
    undefined
  )
  public get _me$(): Observable<DtoMeModel | undefined> {
    return this._meInfo$.asObservable()
  }

  public get me(): DtoMeModel | undefined {
    return this._meInfo$.value
  }

  public set(me: DtoMeModel | undefined) {
    this._meInfo$.next(me)
  }
}
