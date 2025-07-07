import { Component, DebugElement } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { AutofocusAfterInitDirective } from './autofocus-after-init.directive'

@Component({
  imports: [AutofocusAfterInitDirective],
  template: `<input type="text" appAutofocusAfterInit />`,
})
class TestHostComponent {}

describe('AutofocusAfterInitDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>
  let inputEl: DebugElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    })

    fixture = TestBed.createComponent(TestHostComponent)
    fixture.detectChanges()

    inputEl = fixture.debugElement.query(By.css('input'))
  })

  it('should focus the input after view init (microtask)', async () => {
    const focusSpy = spyOn(inputEl.nativeElement, 'focus')

    await Promise.resolve()

    expect(focusSpy).toHaveBeenCalled()
  })
})
