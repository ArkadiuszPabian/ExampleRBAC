import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { BehaviorSubject } from 'rxjs'
import { Permission } from '../models/permission.model'
import { AuthService } from '../services/auth.service'
import { MeService } from '../services/me.service'
import { HasPermissionDirective } from './has-permission.directive'

class MockMeService {
  _me$ = new BehaviorSubject<any>({})
}

class MockAuthService {
  private permissions = new Set<Permission>()

  hasPermission(permission: Permission): boolean {
    return this.permissions.has(permission)
  }

  setPermissions(perms: Permission[]) {
    this.permissions = new Set(perms)
  }
}

@Component({
  imports: [HasPermissionDirective],
  template: `
    <div *appHasPermission="'view:articles'">
      <p class="has-permission">Dashboard Access</p>
    </div>
  `,
})
class TestHostComponent {}

describe('HasPermissionDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>
  let mockAuthService: MockAuthService
  let mockMeService: MockMeService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: MeService, useClass: MockMeService },
      ],
    })

    fixture = TestBed.createComponent(TestHostComponent)
    mockAuthService = TestBed.inject(AuthService) as any
    mockMeService = TestBed.inject(MeService) as any
  })

  it('should render content when permission is granted', () => {
    mockAuthService.setPermissions(['view:articles'])
    mockMeService._me$.next({})
    fixture.detectChanges()

    const el = fixture.debugElement.query(By.css('.has-permission'))
    expect(el).toBeTruthy()
    expect(el.nativeElement.textContent).toContain('Dashboard Access')
  })

  it('should not render content when permission is denied', () => {
    mockAuthService.setPermissions([])
    mockMeService._me$.next({})
    fixture.detectChanges()

    const el = fixture.debugElement.query(By.css('.has-permission'))
    expect(el).toBeNull()
  })
})
