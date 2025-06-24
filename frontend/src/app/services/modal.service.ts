import {
  ComponentRef,
  inject,
  Injectable,
  OnDestroy,
  Type,
} from '@angular/core'
import { Observable, of, Subject, Subscription, switchMap } from 'rxjs'
import { ModalHostComponent } from '../core/modal-host/modal-host.component'
import { ModalModel } from '../models/modal.model'
import { Permission } from '../models/permission.model'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class ModalService implements OnDestroy {
  private readonly _authService = inject(AuthService)
  private readonly _subscription = new Subscription()
  private host: ModalHostComponent | null = null

  constructor() {
    this._subscription.add(
      this._authService.isLoggedIn$().subscribe({
        next: (_isLoggedIn) => {
          this.close()
        },
      })
    )
  }

  public registerHost(host: ModalHostComponent) {
    this.host = host
  }

  public open<TData, TModal extends ModalModel<TData>>(
    component: Type<TModal>,
    permission: Permission,
    data?: unknown
  ): Observable<ComponentRef<TModal> | null> {
    if (!this.host) {
      throw new Error('ModalHost not registered')
    }
    if (!this._authService.hasPermission(permission)) {
      this.close()
      return this._authService.logout()
    }

    const componentRef = this.host.create(component) as ComponentRef<TModal>
    if (data) {
      Object.assign(componentRef.instance as object, data)
    }

    return of(componentRef as ComponentRef<TModal>)
  }

  public runModal<T>(
    modal: Type<ModalModel<T>>,
    permission: Permission,
    data: unknown,
    apiCall$: (result: T) => Observable<object>,
    reloadTrigger$: Subject<void>
  ): void {
    this._subscription.add(
      this.open<T, ModalModel<T>>(modal, permission, data)
        .pipe(
          switchMap((modalRef) => {
            if (modalRef) {
              return modalRef.instance.result
            }
            return of(undefined)
          }),
          switchMap((result) => {
            if (result) {
              return apiCall$(result)
            }
            return of(undefined)
          })
        )
        .subscribe({
          error: (err) => {
            console.error({ err })
            this.close()
          },
          next: () => {
            reloadTrigger$.next()
            this.close()
          },
        })
    )
  }

  public close() {
    this.host?.clear()
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
