import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core'

@Directive({
  selector: '[appAutofocusAfterInit]',
})
export class AutofocusAfterInitDirective implements AfterViewInit {
  private readonly _elementRef = inject(ElementRef)

  ngAfterViewInit() {
    queueMicrotask(() => this._elementRef.nativeElement.focus())
  }
}
