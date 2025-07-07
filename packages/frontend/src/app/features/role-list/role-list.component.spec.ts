import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing'
import { delay, of, throwError } from 'rxjs'

import { NgFor, NgIf } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { HasPermissionDirective } from '../../directives/has-permission.directive'
import { DTOPermission } from '../../models/dto-permission.model'
import { DTORole } from '../../models/dto-role.model'
import { ApiPermissionService } from '../../services/api-permission.service'
import { ApiRoleService } from '../../services/api-role.service'
import { ModalService } from '../../services/modal.service'
import { RoleListComponent } from './role-list.component'

describe('RoleListComponent', () => {
  let component: RoleListComponent
  let fixture: ComponentFixture<RoleListComponent>

  let mockApiRoleService: jasmine.SpyObj<ApiRoleService>
  let mockApiPermissionService: jasmine.SpyObj<ApiPermissionService>
  let mockModalService: jasmine.SpyObj<ModalService>

  beforeEach(async () => {
    mockApiRoleService = jasmine.createSpyObj('ApiRoleService', [
      'getRoles',
      'updateRole',
      'createRole',
      'deleteRole',
    ])
    mockApiPermissionService = jasmine.createSpyObj('ApiPermissionService', [
      'getPermissions',
    ])
    mockModalService = jasmine.createSpyObj('ModalService', ['runModal'])

    await TestBed.configureTestingModule({
      imports: [NgFor, NgIf, HasPermissionDirective, RoleListComponent],
      providers: [
        { provide: ApiRoleService, useValue: mockApiRoleService },
        { provide: ApiPermissionService, useValue: mockApiPermissionService },
        { provide: ModalService, useValue: mockModalService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(RoleListComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should load roles and update state', fakeAsync(() => {
      const roles: DTORole[] = [{ id: 1, roleName: 'Admin' }]
      mockApiRoleService.getRoles.and.returnValue(of(roles))

      component.ngOnInit()
      tick()

      expect(mockApiRoleService.getRoles).toHaveBeenCalled()
      expect(component.roles).toEqual(roles)
      expect(component.isLoading).toBeFalse()
      expect(component.permissionsMap.size).toBe(0)
      expect(component.loadingPermissions.size).toBe(0)
    }))

    it('should handle error and set roles to empty array', fakeAsync(() => {
      mockApiRoleService.getRoles.and.returnValue(
        throwError(() => new Error('error'))
      )
      component.ngOnInit()
      tick()

      expect(component.roles).toEqual([])
      expect(component.isLoading).toBeFalse()
    }))
  })

  describe('fetchPermissions', () => {
    it('should fetch permissions for role not cached', () => {
      const roleId = 1
      const permissions: DTOPermission[] = [
        { id: 100, permissionName: 'view:articles' },
      ]

      mockApiPermissionService.getPermissions.and.returnValue(
        of(permissions).pipe(delay(1000))
      )

      fakeAsync(() => {
        component.fetchPermissions(roleId)
        expect(component.loadingPermissions.has(roleId)).toBeTrue()
        expect(mockApiPermissionService.getPermissions).toHaveBeenCalledWith(
          roleId
        )
        tick(1000)
        expect(component.permissionsMap.get(roleId)).toEqual(permissions)
        expect(component.loadingPermissions.has(roleId)).toBeFalse()
      })
    })

    it('should not fetch permissions if already cached', () => {
      const roleId = 1
      component.permissionsMap.set(roleId, [
        { id: 101, permissionName: 'view:articles' },
      ])

      component.fetchPermissions(roleId)

      expect(mockApiPermissionService.getPermissions).not.toHaveBeenCalled()
    })
  })

  describe('editRole', () => {
    it('should call modalService.runModal with correct params', () => {
      const roleId = 123
      component.editRole(roleId)

      expect(mockModalService.runModal).toHaveBeenCalledWith(
        jasmine.any(Function),
        'update:roles',
        { id: roleId },
        jasmine.any(Function),
        jasmine.any(Object)
      )
    })
  })

  describe('createNewRole', () => {
    it('should call modalService.runModal with create params', () => {
      component.createNewRole()

      expect(mockModalService.runModal).toHaveBeenCalledWith(
        jasmine.any(Function),
        'create:roles',
        {},
        jasmine.any(Function),
        jasmine.any(Object)
      )
    })
  })

  describe('deleteRole', () => {
    it('should call modalService.runModal with delete params', () => {
      const roleId = 321
      component.deleteRole(roleId)

      expect(mockModalService.runModal).toHaveBeenCalledWith(
        jasmine.any(Function),
        'delete:roles',
        { title: 'Are you sure you want to remove this role?' },
        jasmine.any(Function),
        jasmine.any(Object)
      )
    })
  })

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      spyOn(component['destroy$'], 'next')
      spyOn(component['destroy$'], 'complete')

      component.ngOnDestroy()

      expect(component['destroy$'].next).toHaveBeenCalled()
      expect(component['destroy$'].complete).toHaveBeenCalled()
    })
  })
})
