import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { of } from 'rxjs'
import { DTOEditRole } from '../../../models/dto-edit-role.model'
import { ApiAuthService } from '../../../services/api-auth.service'
import { ApiPermissionService } from '../../../services/api-permission.service'
import { ApiRoleService } from '../../../services/api-role.service'
import { RoleEditorModalComponent } from './role-editor-modal.component'

describe('RoleEditorModalComponent', () => {
  let component: RoleEditorModalComponent
  let fixture: ComponentFixture<RoleEditorModalComponent>

  const mockRole: DTOEditRole = {
    roleName: 'Manager',
    permissions: ['update:users'],
  }

  const mockPermissions = [
    { permissionName: 'update:users' },
    { permissionName: 'delete:users' },
  ]

  const apiRoleServiceStub = {
    getSingleRole: jasmine.createSpy().and.returnValue(of(mockRole)),
  }

  const apiPermissionServiceStub = {
    getPermissions: jasmine.createSpy().and.returnValue(of(mockPermissions)),
  }

  const apiAuthServiceStub = {
    status: jasmine.createSpy().and.returnValue(of({})),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleEditorModalComponent, ReactiveFormsModule],
      providers: [
        { provide: ApiRoleService, useValue: apiRoleServiceStub },
        { provide: ApiPermissionService, useValue: apiPermissionServiceStub },
        { provide: ApiAuthService, useValue: apiAuthServiceStub },
        FormBuilder,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(RoleEditorModalComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('title', () => {
    it('should return "Create new role" if not editing', () => {
      component.id = undefined
      expect(component.title).toBe('Create new role')
    })

    it('should return "Edit role" if editing', () => {
      component.id = 1
      expect(component.title).toBe('Edit role')
    })
  })

  describe('save()', () => {
    it('should emit the correct role data', () => {
      spyOn(component.result, 'emit')
      const fb = TestBed.inject(FormBuilder)
      component.form = fb.group({
        roleName: ['Admin'],
        permissions: [['update:users']],
      })

      component.save()

      expect(component.result.emit).toHaveBeenCalledWith({
        roleName: 'Admin',
        permissions: ['update:users'],
      })
    })
  })

  describe('cancel()', () => {
    it('should emit null', () => {
      spyOn(component.result, 'emit')
      component.cancel()
      expect(component.result.emit).toHaveBeenCalledWith(null)
    })
  })

  describe('hasPermission()', () => {
    it('should return true if permission is present', () => {
      const fb = TestBed.inject(FormBuilder)
      component.form = fb.group({
        roleName: ['Manager'],
        permissions: [['update:users']],
      })

      expect(component.hasPermission('update:users')).toBeTrue()
    })

    it('should return false if permission is not present', () => {
      const fb = TestBed.inject(FormBuilder)
      component.form = fb.group({
        roleName: ['Manager'],
        permissions: [['update:users']],
      })

      expect(component.hasPermission('delete:users')).toBeFalse()
    })
  })

  describe('togglePermission()', () => {
    beforeEach(() => {
      const fb = TestBed.inject(FormBuilder)
      component.form = fb.group({
        roleName: ['Manager'],
        permissions: [['update:users']],
      })
    })

    it('should remove permission if already present', () => {
      component.togglePermission('update:users')
      expect(component.form.get('permissions')?.value).toEqual([])
    })

    it('should add permission if not present', () => {
      component.togglePermission('delete:users')
      expect(component.form.get('permissions')?.value).toEqual([
        'update:users',
        'delete:users',
      ])
    })
  })
})
