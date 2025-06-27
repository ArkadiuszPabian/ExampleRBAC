import { Component, Input } from '@angular/core'
import { ModalModel } from '../../../models/modal.model'

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent extends ModalModel<boolean> {
  @Input() title = 'Are you sure?'

  confirm() {
    this.result.emit(true)
  }

  cancel() {
    this.result.emit(false)
  }
}
