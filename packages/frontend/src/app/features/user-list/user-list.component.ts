import { NgFor, NgIf } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import {
  catchError,
  of,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
} from 'rxjs'
import { UserEditorModalComponent } from '../../core/modals/user-editor-modal/user-editor-modal.component'
import { HasPermissionDirective } from '../../directives/has-permission.directive'
import { DTOUser } from '../../models/dto-user.model'
import { ApiUserService } from '../../services/api-user.service'
import { AuthService } from '../../services/auth.service'
import { ModalService } from '../../services/modal.service'

@Component({
  selector: 'app-user-list',
  imports: [
    NgFor,
    NgIf,
    HasPermissionDirective,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit, OnDestroy {
  private readonly _apiUserService = inject(ApiUserService)
  private readonly _modalService = inject(ModalService)
  private readonly _authService = inject(AuthService)
  private readonly destroy$ = new Subject<void>()
  private readonly reloadTrigger$ = new Subject<void>()
  private readonly _subscription = new Subscription()

  public get currentUserId() {
    return this._authService.getUserId()
  }

  public users: DTOUser[] = []

  ngOnInit(): void {
    this.reloadTrigger$
      .pipe(
        switchMap(() => this.loadUsers()),
        catchError((_err) => of([])),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (users) => {
          this.users = users
        },
      })
    this.reloadTrigger$.next()
  }

  public loadUsers() {
    return this._apiUserService.getUsers()
  }

  public createNewUser() {
    this._modalService.runModal(
      UserEditorModalComponent,
      'create:users',
      {},
      (result) => this._apiUserService.createUser(result),
      this.reloadTrigger$
    )
  }

  public editUser(id: number) {
    this._modalService.runModal(
      UserEditorModalComponent,
      'update:users',
      {
        id,
      },
      (result) => this._apiUserService.updateUser(id, result),
      this.reloadTrigger$
    )
  }

  public deleteUser(id: number) {
    this._modalService.runModal(
      UserEditorModalComponent,
      'delete:users',
      {
        title: 'Are you sure you want to remove this user?',
      },
      (_result) => this._apiUserService.deleteUser(id),
      this.reloadTrigger$
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this._subscription.unsubscribe()
  }
}
