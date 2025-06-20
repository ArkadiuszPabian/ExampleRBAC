import { Component, ViewChild, ViewContainerRef } from '@angular/core'

@Component({
  selector: 'app-modal-host',
  imports: [],
  templateUrl: './modal-host.component.html',
  styleUrl: './modal-host.component.scss',
})
export class ModalHostComponent {
  @ViewChild('modalContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef

  clear() {
    this.container.clear()
  }

  create(component: any) {
    this.clear()
    return this.container.createComponent(component)
  }
}
