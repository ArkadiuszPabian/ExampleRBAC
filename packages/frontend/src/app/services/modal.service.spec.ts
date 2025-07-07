import { ComponentRef, EventEmitter } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { of, Subject, throwError } from 'rxjs'
import { ModalHostComponent } from '../core/modal-host/modal-host.component'
import { ModalModel } from '../models/modal.model'
import { Permission } from '../models/permission.model'
import { AuthService } from './auth.service'
import { ModalService } from './modal.service'

describe('ModalService with TestBed', () => {
  let service: ModalService
  let authServiceMock: jasmine.SpyObj<AuthService>
  let hostMock: jasmine.SpyObj<ModalHostComponent>

  // Dummy modal model for testing
  class DummyModal extends ModalModel<any> {
    override result = new EventEmitter<any | null>()
    foo = 'bar'
  }

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'isLoggedIn$',
      'hasPermission',
      'logout',
    ])
    authServiceMock.isLoggedIn$.and.returnValue(of(true))
    authServiceMock.hasPermission.and.returnValue(true)
    authServiceMock.logout.and.returnValue(of(null))

    hostMock = jasmine.createSpyObj('ModalHostComponent', ['create', 'clear'])

    TestBed.configureTestingModule({
      providers: [
        ModalService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    })

    service = TestBed.inject(ModalService)
  })

  describe('registerHost()', () => {
    it('should register host', () => {
      service.registerHost(hostMock)
      // Access private member via any cast for test validation
      expect((service as any).host).toBe(hostMock)
    })
  })

  describe('open()', () => {
    it('should throw if no host registered', () => {
      expect(() =>
        service.open(DummyModal, 'view:articles' as Permission)
      ).toThrowError('ModalHost not registered')
    })

    it('should call logout and close if permission denied', (done) => {
      service.registerHost(hostMock)
      authServiceMock.hasPermission.and.returnValue(false)
      spyOn(service, 'close').and.callThrough()
      authServiceMock.logout.and.returnValue(of(null))

      service.open(DummyModal, 'view:articles' as Permission).subscribe({
        next: (res) => {
          expect(service.close).toHaveBeenCalled()
          expect(authServiceMock.logout).toHaveBeenCalled()
          expect(res).toBeNull()
          done()
        },
      })
    })

    it('should create modal and assign data', (done) => {
      service.registerHost(hostMock)
      const modalInstance = new DummyModal()
      const componentRefMock = {
        instance: modalInstance,
      } as unknown as ComponentRef<DummyModal>

      hostMock.create.and.returnValue(componentRefMock)

      const data = { foo: 'bar' }
      service.open(DummyModal, 'view:articles' as Permission, data).subscribe({
        next: (componentRef) => {
          expect(hostMock.create).toHaveBeenCalledWith(DummyModal)
          expect(componentRef).toBe(componentRefMock)
          expect(componentRef?.instance.foo).toBe('bar')
          done()
        },
      })
    })
  })

  describe('runModal()', () => {
    it('should call apiCall$ with modal result and reload', () => {
      service.registerHost(hostMock)
      const modalInstance = new DummyModal()
      const componentRefMock = {
        instance: modalInstance,
      } as unknown as ComponentRef<ModalModel<any>>

      hostMock.create.and.returnValue(componentRefMock)

      const reloadTrigger$ = new Subject<void>()
      const apiCallSpy = jasmine.createSpy('apiCall$').and.returnValue(of({}))

      spyOn(service, 'close').and.callThrough()

      service.runModal(
        DummyModal,
        'view:articles' as Permission,
        {},
        apiCallSpy,
        reloadTrigger$
      )

      let reloadCalled = false
      reloadTrigger$.subscribe(() => (reloadCalled = true))

      modalInstance.result.next({ foo: 'bar' })
      modalInstance.result.complete()

      expect(apiCallSpy).toHaveBeenCalledWith({ foo: 'bar' })
      expect(reloadCalled).toBeTrue()
      expect(service.close).toHaveBeenCalled()
    })

    it('should close modal and log error on API error', () => {
      service.registerHost(hostMock)
      const modalInstance = new DummyModal()
      const componentRefMock = {
        instance: modalInstance,
      } as unknown as ComponentRef<ModalModel<any>>

      hostMock.create.and.returnValue(componentRefMock)

      const reloadTrigger$ = new Subject<void>()
      const error = new Error('fail')
      const apiCallSpy = jasmine
        .createSpy('apiCall$')
        .and.returnValue(throwError(() => error))

      spyOn(console, 'error')
      spyOn(service, 'close').and.callThrough()

      service.runModal(
        DummyModal,
        'view:articles' as Permission,
        {},
        apiCallSpy,
        reloadTrigger$
      )

      modalInstance.result.next({ foo: 'bar' })
      modalInstance.result.complete()

      expect(apiCallSpy).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledWith({ err: error })
      expect(service.close).toHaveBeenCalled()
    })
  })

  describe('close()', () => {
    it('should call host.clear', () => {
      service.registerHost(hostMock)
      service.close()
      expect(hostMock.clear).toHaveBeenCalled()
    })
  })

  describe('ngOnDestroy()', () => {
    it('should unsubscribe', () => {
      const sub = (service as any)._subscription
      spyOn(sub, 'unsubscribe')

      service.ngOnDestroy()

      expect(sub.unsubscribe).toHaveBeenCalled()
    })
  })
})
