import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ElementRef } from '@angular/core'
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { provideRouter, Router } from '@angular/router'
import { of, Subject } from 'rxjs'
import { AuthService } from '../../services/auth.service'
import { SignInComponent } from './sign-in.component'

describe('SignInComponent', () => {
  let fixture: ComponentFixture<SignInComponent>
  let component: SignInComponent

  let authServiceMock: jasmine.SpyObj<AuthService>
  let router: Router

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login'])

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SignInComponent)
    component = fixture.componentInstance
    router = TestBed.inject(Router)

    component.username = {
      nativeElement: {
        focus: jasmine.createSpy('focus'),
      },
    } as unknown as ElementRef
  })

  it('should create and initialize form on ngOnInit', () => {
    component.ngOnInit()
    expect(component.form).toBeDefined()
    expect(component.usernameField).toBe(component.form.get('username'))
    expect(component.passwordField).toBe(component.form.get('password'))
  })

  it('should show validation error if username is invalid on signIn', () => {
    component.ngOnInit()
    component.form.get('username')!.setValue('')
    component.form.get('password')!.setValue('validpass')

    component.signIn()

    expect(component.validationErrorMsg).toBe('Username is required')
  })

  it('should show validation error if password is invalid on signIn', () => {
    component.ngOnInit()
    component.form.get('username')!.setValue('validuser')
    component.form.get('password')!.setValue('')

    component.signIn()

    expect(component.validationErrorMsg).toBe('Password is required')
  })

  it('should call authService.login and navigate on successful login', fakeAsync(() => {
    spyOn(router, 'navigate')

    component.ngOnInit()
    component.form.get('username')!.setValue('validuser')
    component.form.get('password')!.setValue('validpass')

    const loginResponse$ = of({ token: 'abc123' })
    authServiceMock.login.and.returnValue(loginResponse$)

    component.signIn()
    tick(500)

    expect(authServiceMock.login).toHaveBeenCalledWith('validuser', 'validpass')
    expect(router.navigate).toHaveBeenCalledWith([''])
    expect(component.validationErrorMsg).toBeUndefined()
  }))

  it('should set validationErrorMsg if login returns string error', fakeAsync(() => {
    spyOn(router, 'navigate')

    component.ngOnInit()
    component.form.get('username')!.setValue('validuser')
    component.form.get('password')!.setValue('validpass')

    const loginResponse$ = of('Invalid credentials')
    authServiceMock.login.and.returnValue(loginResponse$)

    component.signIn()
    tick(500)

    expect(component.validationErrorMsg).toBe('Invalid credentials')
    expect(router.navigate).not.toHaveBeenCalled()
  }))

  it('should enable form and focus username after login completes', fakeAsync(() => {
    component.ngOnInit()
    component.form.get('username')!.setValue('validuser')
    component.form.get('password')!.setValue('validpass')

    const subject = new Subject<any>()
    authServiceMock.login.and.returnValue(subject.asObservable())

    component.signIn()
    expect(component.form.disabled).toBeTrue()

    subject.next({ token: 'abc123' })
    subject.complete()
    tick()

    expect(component.form.enabled).toBeTrue()
    expect(component.username.nativeElement.focus).toHaveBeenCalled()
  }))

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    component.ngOnInit()
    const sub = component['_subscription']
    spyOn(sub, 'unsubscribe')

    component.ngOnDestroy()

    expect(sub.unsubscribe).toHaveBeenCalled()
  })
})
