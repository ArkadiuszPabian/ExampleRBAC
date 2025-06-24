import { Directive, EventEmitter, Output } from '@angular/core'

@Directive()
export abstract class ModalModel<T> {
  @Output()
  public result = new EventEmitter<T | null>()
}
