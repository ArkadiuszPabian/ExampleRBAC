import {
  ComponentRef,
  inject,
  Injectable,
  OnDestroy,
  Type,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { ModalHostComponent } from '../core/modal-host/modal-host.component'
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

  public open<T extends object>(
    component: Type<T>,
    permission: Permission,
    data?: any
  ): ComponentRef<T> | null {
    if (!this.host) {
      throw new Error('ModalHost not registered')
    }
    if (
      this._authService.hasTokenExpired() ||
      !this._authService.hasPermission(permission)
    ) {
      this._authService.logout()
      this.close()
      return null
    }

    const componentRef = this.host.create(component) as ComponentRef<T>
    if (data) {
      Object.assign(componentRef.instance as object, data)
    }

    return componentRef as ComponentRef<T>
  }

  public close() {
    this.host?.clear()
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
