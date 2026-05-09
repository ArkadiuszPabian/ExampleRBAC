import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { of, Subscription } from 'rxjs'
import { AppComponent } from './app.component'
import { ModalHostComponent } from './core/modal-host/modal-host.component'
import { AuthService } from './services/auth.service'
import { ModalService } from './services/modal.service'

@Component({
  selector: 'app-modal-host',
  template: '',
  standalone: true,
})
class ModalHostComponentStub {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent

  const authServiceStub = {
    restoreSession: jasmine.createSpy().and.returnValue(of(true)),
  }

  const modalServiceStub = {
    registerHost: jasmine.createSpy(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, ModalHostComponentStub],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
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
    it('should restore the session via AuthService', () => {
      component.ngOnInit()
      expect(authServiceStub.restoreSession).toHaveBeenCalled()
    })
  })

  describe('ngAfterViewInit()', () => {
    it('should register modal host with ModalService', () => {
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
      ;(component as any)._subscription = sub

      component.ngOnDestroy()

      expect(spy).toHaveBeenCalled()
    })
  })
})
