import { NgFor, NgIf } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs'
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
  permissionsMap = new Map<number, DTOPermission[]>() // roleId -> permissions
  loadingPermissions = new Set<number>() // optional: show loading spinner if needed

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
          console.debug({ roles })
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
          console.debug({ permissions })
          this.permissionsMap.set(roleId, permissions)
          this.loadingPermissions.delete(roleId)
        },
      })
    }
  }

  // public editRole(id: number) {
  //   this._modalService
  //     .open(ArticleEditorModalComponent, { id })
  //     .instance.result.pipe(
  //       switchMap((result) => {
  //         if (result !== null) {
  //           return this._apiRoleService.updateRole(id, result)
  //         }
  //         return of(undefined)
  //       })
  //     )
  //     .subscribe({
  //       error: (err) => {
  //         console.error({ err })
  //         this._modalService.close()
  //       },
  //       next: () => {
  //         this.reloadTrigger$.next()
  //         this._modalService.close()
  //       },
  //     })
  // }

  // public createNewArticle() {
  //   this._modalService
  //     .open(ArticleEditorModalComponent, {})
  //     .instance.result.pipe(
  //       switchMap((result) => {
  //         if (result !== null) {
  //           return this._apiArticleService.createArticle(result)
  //         }
  //         return of(undefined)
  //       })
  //     )
  //     .subscribe({
  //       error: (err) => {
  //         console.error({ err })
  //         this._modalService.close()
  //       },
  //       next: () => {
  //         this.reloadTrigger$.next()
  //         this._modalService.close()
  //       },
  //     })
  // }

  // public deleteArticle(id: number) {
  //   this._modalService
  //     .open(ConfirmModalComponent, {
  //       title: 'Are you sure you want to remove the article?',
  //     })
  //     .instance.result.pipe(
  //       switchMap((result) => {
  //         if (result === true) {
  //           return this._apiArticleService.deleteArticle(id)
  //         }
  //         return of(undefined)
  //       })
  //     )
  //     .subscribe({
  //       error: () => {
  //         this._modalService.close()
  //       },
  //       next: () => {
  //         this.reloadTrigger$.next()
  //         this._modalService.close()
  //       },
  //     })
  // }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
