import { NgFor, NgIf } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs'
import { ConfirmModalComponent } from '../../core/modals/confirm-modal/confirm-modal.component'
import { RoleEditorModalComponent } from '../../core/modals/role-editor-modal/role-editor-modal.component'
import { HasPermissionDirective } from '../../directives/has-permission.directive'
import { DTOPermission } from '../../models/dto-permission.model'
import { DTORole } from '../../models/dto-role.model'
import { ApiPermissionService } from '../../services/api-permission.service'
import { ApiRoleService } from '../../services/api-role.service'
import { ModalService } from '../../services/modal.service'

@Component({
  selector: 'app-role-list',
  imports: [
    NgFor,
    NgIf,
    HasPermissionDirective,
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
})
export class RoleListComponent implements OnInit, OnDestroy {
  private readonly _apiRoleService = inject(ApiRoleService)
  private readonly _apiPermissionService = inject(ApiPermissionService)
  private readonly _modalService = inject(ModalService)
  private readonly destroy$ = new Subject<void>()
  private readonly reloadTrigger$ = new Subject<void>()

  public readonly permissionsMap = new Map<number, DTOPermission[]>()
  public readonly loadingPermissions = new Set<number>()

  public roles: DTORole[] = []
  public isLoading = true

  ngOnInit(): void {
    this.reloadTrigger$
      .pipe(
        switchMap(() => this.loadRoles()),
        catchError((_err) => of([])),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (roles) => {
          this.permissionsMap.clear()
          this.loadingPermissions.clear()
          this.isLoading = false
          this.roles = roles
        },
      })
    this.reloadTrigger$.next()
  }

  public loadRoles() {
    return this._apiRoleService.getRoles()
  }

  fetchPermissions(roleId: number) {
    if (!this.permissionsMap.has(roleId)) {
      this.loadingPermissions.add(roleId)
      this._apiPermissionService.getPermissions(roleId).subscribe({
        next: (permissions) => {
          this.permissionsMap.set(roleId, permissions)
          this.loadingPermissions.delete(roleId)
        },
      })
    }
  }

  public editRole(id: number) {
    this._modalService.runModal(
      RoleEditorModalComponent,
      'update:roles',
      { id },
      (result) => this._apiRoleService.updateRole(id, result),
      this.reloadTrigger$
    )
  }

  public createNewRole() {
    this._modalService.runModal(
      RoleEditorModalComponent,
      'create:roles',
      {},
      (result) => this._apiRoleService.createRole(result),
      this.reloadTrigger$
    )
  }

  public deleteRole(id: number) {
    this._modalService.runModal(
      ConfirmModalComponent,
      'delete:roles',
      {
        title: 'Are you sure you want to remove this role?',
      },
      (_result) => this._apiRoleService.deleteRole(id),
      this.reloadTrigger$
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
