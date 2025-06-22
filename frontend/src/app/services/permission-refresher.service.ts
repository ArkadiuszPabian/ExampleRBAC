import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PermissionRefresherService {
  private readonly _subject = new BehaviorSubject<void>(undefined)

  public refreshPermissions() {
    this._subject.next()
  }

  public permissionChanged$ = this._subject.asObservable()
}
