import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing'
import { of, Subject, throwError } from 'rxjs'
import { UserEditorModalComponent } from '../../core/modals/user-editor-modal/user-editor-modal.component'
import { DTOUser } from '../../models/dto-user.model'
import { ApiUserService } from '../../services/api-user.service'
import { AuthService } from '../../services/auth.service'
import { ModalService } from '../../services/modal.service'
import { UserListComponent } from './user-list.component'

describe('UserListComponent', () => {
  let component: UserListComponent
  let fixture: ComponentFixture<UserListComponent>
  let apiUserServiceMock: jasmine.SpyObj<ApiUserService>
  let modalServiceMock: jasmine.SpyObj<ModalService>
  let authServiceMock: jasmine.SpyObj<AuthService>

  beforeEach(() => {
    apiUserServiceMock = jasmine.createSpyObj('ApiUserService', [
      'getUsers',
      'createUser',
      'updateUser',
      'deleteUser',
    ])
    modalServiceMock = jasmine.createSpyObj('ModalService', ['runModal'])
    authServiceMock = jasmine.createSpyObj('AuthService', ['getUserId'])

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiUserService, useValue: apiUserServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })

    fixture = TestBed.createComponent(UserListComponent)
    component = fixture.componentInstance
  })

  describe('currentUserId', () => {
    it('should return user id from auth service', () => {
      authServiceMock.getUserId.and.returnValue(42)
      expect(component.currentUserId).toBe(42)
      expect(authServiceMock.getUserId).toHaveBeenCalled()
    })
  })

  describe('ngOnInit()', () => {
    it('should load users and update users property', fakeAsync(() => {
      const users: DTOUser[] = [{ id: 1, username: 'John' }] as DTOUser[]
      apiUserServiceMock.getUsers.and.returnValue(of(users))

      component.ngOnInit()
      tick()

      expect(apiUserServiceMock.getUsers).toHaveBeenCalled()
      expect(component.users).toEqual(users)
    }))

    it('should handle error and set users to empty array', fakeAsync(() => {
      apiUserServiceMock.getUsers.and.returnValue(
        throwError(() => new Error('fail'))
      )

      component.ngOnInit()
      tick()

      expect(component.users).toEqual([])
    }))
  })

  describe('loadUsers()', () => {
    it('should call ApiUserService.getUsers', () => {
      const user = {
        id: 1,
        username: 'John',
        isActivated: true,
        roleName: 'admin',
      }
      const users$ = of([user] as DTOUser[])
      apiUserServiceMock.getUsers.and.returnValue(users$)

      const result = component.loadUsers()

      expect(apiUserServiceMock.getUsers).toHaveBeenCalled()
      result.subscribe((users) => {
        expect(users).toEqual([user])
      })
    })
  })

  describe('createNewUser()', () => {
    it('should call modalService.runModal with correct params', () => {
      component.createNewUser()

      expect(modalServiceMock.runModal).toHaveBeenCalledWith(
        UserEditorModalComponent,
        'create:users',
        {},
        jasmine.any(Function),
        jasmine.any(Subject)
      )
    })
  })

  describe('editUser()', () => {
    it('should call modalService.runModal with correct params and id', () => {
      const userId = 123
      component.editUser(userId)

      expect(modalServiceMock.runModal).toHaveBeenCalledWith(
        UserEditorModalComponent,
        'update:users',
        { id: userId },
        jasmine.any(Function),
        jasmine.any(Subject)
      )
    })
  })

  describe('deleteUser()', () => {
    it('should call modalService.runModal with correct params and id', () => {
      const userId = 999
      component.deleteUser(userId)

      expect(modalServiceMock.runModal).toHaveBeenCalledWith(
        UserEditorModalComponent,
        'delete:users',
        { title: 'Are you sure you want to remove this user?' },
        jasmine.any(Function),
        jasmine.any(Subject)
      )
    })
  })

  describe('ngOnDestroy()', () => {
    it('should complete destroy$ and unsubscribe from subscriptions', () => {
      spyOn(component['destroy$'], 'next').and.callThrough()
      spyOn(component['destroy$'], 'complete').and.callThrough()
      spyOn(component['_subscription'], 'unsubscribe').and.callThrough()

      component.ngOnDestroy()

      expect(component['destroy$'].next).toHaveBeenCalled()
      expect(component['destroy$'].complete).toHaveBeenCalled()
      expect(component['_subscription'].unsubscribe).toHaveBeenCalled()
    })
  })
})
