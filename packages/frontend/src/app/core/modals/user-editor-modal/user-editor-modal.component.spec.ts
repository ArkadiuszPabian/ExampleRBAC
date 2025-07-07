import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { of } from 'rxjs'
import { DTOEditUser } from '../../../models/dto-edit-user.model'
import { DTORole } from '../../../models/dto-role.model'
import { ApiRoleService } from '../../../services/api-role.service'
import { ApiUserService } from '../../../services/api-user.service'
import { UserEditorModalComponent } from './user-editor-modal.component'

describe('UserEditorModalComponent', () => {
  let component: UserEditorModalComponent
  let fixture: ComponentFixture<UserEditorModalComponent>

  const mockRoles: DTORole[] = [{ id: 1, roleName: 'admin' }]
  const mockUser: DTOEditUser = {
    username: 'johndoe',
    password: '',
    isActivated: true,
    roleId: '1',
  }

  const apiUserServiceStub = {
    getSingleUser: jasmine.createSpy().and.returnValue(of(mockUser)),
  }

  const apiRoleServiceStub = {
    getRoles: jasmine.createSpy().and.returnValue(of(mockRoles)),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditorModalComponent, ReactiveFormsModule],
      providers: [
        { provide: ApiUserService, useValue: apiUserServiceStub },
        { provide: ApiRoleService, useValue: apiRoleServiceStub },
        FormBuilder,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(UserEditorModalComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('title', () => {
    it('should return "Create new user" when creating', () => {
      component.id = undefined
      expect(component.title).toBe('Create new user')
    })

    it('should return "Edit user" when editing', () => {
      component.id = 1
      expect(component.title).toBe('Edit user')
    })
  })

  describe('save()', () => {
    it('should emit created user', () => {
      spyOn(component.result, 'emit')
      const fb = TestBed.inject(FormBuilder)
      component.roles = mockRoles
      component.form = fb.group({
        username: ['newuser'],
        password: ['newpass'],
        isActivated: [true],
        roleId: ['1'],
      })

      component.save()

      expect(component.result.emit).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'newpass',
        isActivated: true,
        roleId: '1',
      })
    })

    it('should emit edited user without password if not enabled', () => {
      component.id = 1 // editing mode
      spyOn(component.result, 'emit')
      const fb = TestBed.inject(FormBuilder)
      component.roles = mockRoles
      component.form = fb.group({
        username: ['editeduser'],
        passwordFieldEnabled: [false],
        password: ['somepass'],
        isActivated: [true],
        roleId: ['1'],
      })

      component.save()

      expect(component.result.emit).toHaveBeenCalledWith({
        username: 'editeduser',
        password: undefined,
        isActivated: true,
        roleId: '1',
      })
    })

    it('should emit edited user with password if enabled', () => {
      component.id = 1 // editing mode
      spyOn(component.result, 'emit')
      const fb = TestBed.inject(FormBuilder)
      component.roles = mockRoles
      component.form = fb.group({
        username: ['editeduser'],
        passwordFieldEnabled: [true],
        password: ['somepass'],
        isActivated: [true],
        roleId: ['1'],
      })

      component.save()

      expect(component.result.emit).toHaveBeenCalledWith({
        username: 'editeduser',
        password: 'somepass',
        isActivated: true,
        roleId: '1',
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
})
