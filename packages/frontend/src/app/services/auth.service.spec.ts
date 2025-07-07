import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { of, throwError } from 'rxjs'
import { DtoMeModel } from '../models/dto-me.model'
import { AccessTokenStorageService } from './access-token-storage.service'
import { ApiAuthService } from './api-auth.service'
import { ApiMeService } from './api-me.service'
import { AuthService } from './auth.service'
import { MeService } from './me.service'

describe('AuthService', () => {
  let service: AuthService
  let apiAuthServiceSpy: jasmine.SpyObj<ApiAuthService>
  let apiMeServiceSpy: jasmine.SpyObj<ApiMeService>
  let accessTokenStorageSpy: jasmine.SpyObj<AccessTokenStorageService>
  let meServiceSpy: jasmine.SpyObj<MeService>
  let routerSpy: jasmine.SpyObj<Router>

  beforeEach(() => {
    apiAuthServiceSpy = jasmine.createSpyObj('ApiAuthService', [
      'signIn',
      'signOut',
    ])
    apiMeServiceSpy = jasmine.createSpyObj('ApiMeService', ['getMyInfo'])
    accessTokenStorageSpy = jasmine.createSpyObj('AccessTokenStorageService', [
      'store',
    ])
    meServiceSpy = jasmine.createSpyObj('MeService', ['set'], {
      me: {
        id: 123,
        name: 'John',
        permissions: ['view:articles', 'create:articles'],
      },
    })
    routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiAuthService, useValue: apiAuthServiceSpy },
        { provide: ApiMeService, useValue: apiMeServiceSpy },
        { provide: AccessTokenStorageService, useValue: accessTokenStorageSpy },
        { provide: MeService, useValue: meServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    })

    service = TestBed.inject(AuthService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('login', () => {
    it('should login successfully and set user info', (done) => {
      const fakeToken = 'token123'
      const fakeUserInfo: DtoMeModel = {
        id: 1,
        name: 'Alice',
        permissions: ['view:articles'],
      }
      apiAuthServiceSpy.signIn.and.returnValue(of({ accessToken: fakeToken }))
      apiMeServiceSpy.getMyInfo.and.returnValue(of(fakeUserInfo))
      meServiceSpy.set.and.stub()
      accessTokenStorageSpy.store.and.stub()

      service.login('user', 'pass').subscribe({
        next: (res) => {
          expect(accessTokenStorageSpy.store).toHaveBeenCalledWith(fakeToken)
          expect(meServiceSpy.set).toHaveBeenCalledWith(fakeUserInfo)
          expect(service.isLoggedIn()).toBeTrue()
          expect(res).toEqual(fakeUserInfo)
          done()
        },
        error: done.fail,
      })
    })

    it('should handle login error and logout', (done) => {
      const fakeError = { error: { reason: 'Invalid credentials' } }
      apiAuthServiceSpy.signIn.and.returnValue(throwError(() => fakeError))
      meServiceSpy.set.and.stub()
      apiAuthServiceSpy.signOut.and.returnValue(of(null))
      routerSpy.navigate.and.stub()

      service.login('user', 'wrongpass').subscribe({
        next: (errorMsg) => {
          expect(meServiceSpy.set).toHaveBeenCalledWith(undefined)
          expect(apiAuthServiceSpy.signOut).toHaveBeenCalled()
          expect(routerSpy.navigate).toHaveBeenCalledWith(['sign-in'])
          expect(errorMsg).toBe('Invalid credentials')
          expect(service.isLoggedIn()).toBeFalse()
          done()
        },
        error: done.fail,
      })
    })
  })

  it('should return current login state', () => {
    expect(service.isLoggedIn()).toBeFalse()
    ;(service as any)._authState$.next(true)
    expect(service.isLoggedIn()).toBeTrue()
  })

  it('should return isLoggedIn$ observable', (done) => {
    service.isLoggedIn$().subscribe((val) => {
      expect(typeof val).toBe('boolean')
      done()
    })
  })

  it('should check permissions correctly', () => {
    expect(service.hasPermission('view:articles')).toBeTrue()
    expect(service.hasPermission('delete:articles')).toBeFalse()
  })

  it('should return user ID and name', () => {
    expect(service.getUserId()).toBe(123)
    expect(service.getLoggedUser()).toBe('John')
  })

  describe('logout', () => {
    it('should logout properly', (done) => {
      meServiceSpy.set.and.stub()
      apiAuthServiceSpy.signOut.and.returnValue(of(null))
      routerSpy.navigate.and.stub()

      const result$ = service.logout()
      result$.subscribe(() => {
        expect(meServiceSpy.set).toHaveBeenCalledWith(undefined)
        expect(routerSpy.navigate).toHaveBeenCalledWith(['sign-in'])
        expect(service.isLoggedIn()).toBeFalse()
        done()
      })
    })
  })
})
