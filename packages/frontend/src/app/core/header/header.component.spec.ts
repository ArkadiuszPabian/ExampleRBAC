import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'
import { of, Subject } from 'rxjs'
import { AuthService } from '../../services/auth.service'
import { MeService } from '../../services/me.service'
import { HeaderComponent } from './header.component'

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>
  let component: HeaderComponent
  let router: Router
  let authService: jasmine.SpyObj<AuthService>
  let meService$: Subject<any>

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', [
      'getLoggedUser',
      'logout',
    ])
    meService$ = new Subject()

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        {
          provide: MeService,
          useValue: {
            _me$: meService$.asObservable(),
          },
        },
        provideRouter([]),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    router = TestBed.inject(Router)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should set logged user on init and update on _me$ emission', () => {
    authService.getLoggedUser.and.returnValue('User1')

    component.ngOnInit()
    expect(component.loggedUser).toBe('User1')

    authService.getLoggedUser.and.returnValue('User2')
    meService$.next({})
    expect(component.loggedUser).toBe('User2')
  })

  it('should navigate to roles page and close menu', () => {
    spyOn(component, 'closeMenu')
    spyOn(router, 'navigate')
    component.navToRolesPage()
    expect(router.navigate).toHaveBeenCalledWith(['roles/edit'])
    expect(component.closeMenu).toHaveBeenCalled()
  })

  it('should navigate to users page and close menu', () => {
    spyOn(component, 'closeMenu')
    spyOn(router, 'navigate')
    component.navToUsersPage()
    expect(router.navigate).toHaveBeenCalledWith(['users/edit'])
    expect(component.closeMenu).toHaveBeenCalled()
  })

  it('should navigate to sign-in page', () => {
    spyOn(router, 'navigate')
    component.navToSignIn()
    expect(router.navigate).toHaveBeenCalledWith(['sign-in'])
  })

  it('should disable signOut button and call logout', () => {
    spyOn(component, 'closeMenu')
    const logout$ = of(null)
    authService.logout.and.returnValue(logout$)

    component.signOut()

    expect(component.signOutMenuItemEnabled).toBeFalse()
    expect(authService.logout).toHaveBeenCalled()
  })
})
