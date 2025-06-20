import { ComponentRef, Injectable, Type } from '@angular/core'
import { ModalHostComponent } from '../core/modal-host/modal-host.component'

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private host: ModalHostComponent | null = null

  registerHost(host: ModalHostComponent) {
    this.host = host
  }

  open<T extends object>(component: Type<T>, data?: any): ComponentRef<T> {
    if (!this.host) throw new Error('ModalHost not registered')

    const componentRef = this.host.create(component) as ComponentRef<T>
    if (data) {
      Object.assign(componentRef.instance as object, data)
    }

    return componentRef as ComponentRef<T>
  }

  close() {
    this.host?.clear()
  }
}
