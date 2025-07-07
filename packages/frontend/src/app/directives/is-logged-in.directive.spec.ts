import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { BehaviorSubject } from 'rxjs'
import { MeService } from '../services/me.service'
import { IsLoggedInDirective } from './is-logged-in.directive'

class MockMeService {
  _me$ = new BehaviorSubject<any>(null)
}

@Component({
  imports: [IsLoggedInDirective],
  template: `
    <div *appIsLoggedIn="true">
      <p class="logged-in">Welcome back!</p>
    </div>
    <div *appIsLoggedIn="false">
      <p class="logged-out">Please log in</p>
    </div>
  `,
})
class TestHostComponent {}

describe('IsLoggedInDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>
  let mockService: MockMeService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: MeService, useClass: MockMeService },
      ],
    })

    fixture = TestBed.createComponent(TestHostComponent)
    mockService = TestBed.inject(MeService) as any
  })

  it('should show logged-in content when _me$ emits truthy', () => {
    mockService._me$.next({})
    fixture.detectChanges()

    const loggedInText = fixture.debugElement.query(By.css('.logged-in'))
    expect(loggedInText).toBeTruthy()
    expect(loggedInText.nativeElement.textContent).toContain('Welcome back!')

    const loggedOutText = fixture.debugElement.query(By.css('.logged-out'))
    expect(loggedOutText).toBeNull()
  })

  it('should show logged-out content when _me$ emits falsy', () => {
    mockService._me$.next(null)
    fixture.detectChanges()

    const loggedOutText = fixture.debugElement.query(By.css('.logged-out'))
    expect(loggedOutText).toBeTruthy()
    expect(loggedOutText.nativeElement.textContent).toContain('Please log in')

    const loggedInText = fixture.debugElement.query(By.css('.logged-in'))
    expect(loggedInText).toBeNull()
  })
})
