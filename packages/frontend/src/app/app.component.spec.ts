import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { of, Subscription } from 'rxjs'
import { AppComponent } from './app.component'
import { ModalHostComponent } from './core/modal-host/modal-host.component'
import { ApiMeService } from './services/api-me.service'
import { MeService } from './services/me.service'
import { ModalService } from './services/modal.service'

// Stub for ModalHostComponent
@Component({
  selector: 'app-modal-host',
  template: '',
  standalone: true,
})
class ModalHostComponentStub {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent

  const mockUser = { id: 1, username: 'test-user' }

  const apiMeServiceStub = {
    getMyInfo: jasmine.createSpy().and.returnValue(of(mockUser)),
  }

  const meServiceStub = {
    set: jasmine.createSpy(),
  }

  const modalServiceStub = {
    registerHost: jasmine.createSpy(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, ModalHostComponentStub],
      providers: [
        { provide: ApiMeService, useValue: apiMeServiceStub },
        { provide: MeService, useValue: meServiceStub },
        { provide: ModalService, useValue: modalServiceStub },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit()', () => {
    it('should call ApiMeService.getMyInfo() and MeService.set()', () => {
      component.ngOnInit()
      expect(apiMeServiceStub.getMyInfo).toHaveBeenCalled()
      expect(meServiceStub.set).toHaveBeenCalledWith(mockUser)
    })
  })

  describe('ngAfterViewInit()', () => {
    it('should register modal host with ModalService', () => {
      // Assign modalHost publicly as it is a public ViewChild property
      component.modalHost = {} as ModalHostComponent
      component.ngAfterViewInit()
      expect(modalServiceStub.registerHost).toHaveBeenCalledWith(
        component.modalHost
      )
    })
  })

  describe('ngOnDestroy()', () => {
    it('should unsubscribe from subscriptions', () => {
      const sub = new Subscription()
      const spy = spyOn(sub, 'unsubscribe')
      // override private subscription for test
      ;(component as any)._subscription = sub

      component.ngOnDestroy()

      expect(spy).toHaveBeenCalled()
    })
  })
})
