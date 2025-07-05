import { NgClass, NgFor, NgIf } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { map, Subscription, switchMap } from 'rxjs'
import { DTOEditRole } from '../../../models/dto-edit-role.model'
import { ModalModel } from '../../../models/modal.model'
import { Permission, PERMISSIONS } from '../../../models/permission.model'
import { ApiPermissionService } from '../../../services/api-permission.service'
import { ApiRoleService } from '../../../services/api-role.service'
import { ApiAuthService } from '../../../services/api-auth.service'

@Component({
  selector: 'app-role-editor-modal',
  imports: [
    NgFor,
    NgIf,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './role-editor-modal.component.html',
  styleUrl: './role-editor-modal.component.scss',
})
export class RoleEditorModalComponent extends ModalModel<DTOEditRole> {
  private readonly _formBuilder = inject(FormBuilder)
  private readonly _apiRoleService = inject(ApiRoleService)
  private readonly _apiPermissionService = inject(ApiPermissionService)
  private readonly _apiAuthService = inject(ApiAuthService)
  private readonly _subscription = new Subscription()

  public form!: FormGroup
  public isLoading = true

  public get isEditing() {
    return !!this.id
  }

  public allPermissions = PERMISSIONS

  ngOnInit(): void {
    if (this.isEditing) {
      this._subscription.add(
        this._apiRoleService
          .getSingleRole(this.id!)
          .pipe(
            switchMap((role) =>
              this._apiPermissionService
                .getPermissions(role.id)
                .pipe(map((dbPermissions) => ({ role, dbPermissions })))
            )
          )
          .subscribe({
            next: ({ role, dbPermissions }) => {
              this.form = this._formBuilder.group({
                roleName: [role.roleName, [Validators.required]],
                permissions: [
                  dbPermissions.map((permission) => permission.permissionName),
                ],
              })
              this.isLoading = false
            },
          })
      )
    } else {
      this._subscription.add(
        this._apiAuthService.status().subscribe({
          next: () => {
            this.form = this._formBuilder.group({
              roleName: ['', [Validators.required]],
              permissions: [[]],
            })
          },
          complete: () => {
            this.isLoading = false
          },
        })
      )
    }
  }

  public get roleField() {
    return this.form.get('role')
  }

  public get isRoleInvalid() {
    return (this.roleField?.dirty && this.roleField?.invalid) === true
      ? true
      : undefined
  }

  public get title() {
    return this.isEditing === false ? 'Create new role' : 'Edit role'
  }

  public hasPermission(permission: Permission) {
    const permissionField = this.form.get('permissions')
    if (!permissionField) {
      return false
    }

    return permissionField.value.some(
      (dbPermission: Permission) => dbPermission === permission
    )
  }

  public togglePermission(permission: Permission) {
    const permissionField = this.form.get('permissions')
    if (!permissionField) {
      return
    }

    const existingFieldIndex = permissionField.value.indexOf(permission)

    if (existingFieldIndex > -1) {
      permissionField.value.splice(existingFieldIndex, 1)
    } else {
      permissionField.value.push(permission)
    }
  }

  @Input() id?: number

  save() {
    const role: DTOEditRole = {
      roleName: this.form.get('roleName')?.value,
      permissions: this.form.get('permissions')?.value,
    }

    this.result.emit(role)
  }

  cancel() {
    this.result.emit(null)
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
