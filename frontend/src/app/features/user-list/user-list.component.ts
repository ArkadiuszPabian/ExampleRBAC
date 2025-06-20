import { NgFor, NgIf } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs'
import { ConfirmModalComponent } from '../../core/modals/confirm-modal/confirm-modal.component'
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
          console.debug({ users })
          this.users = users
        },
      })
    this.reloadTrigger$.next()
  }

  public loadUsers() {
    return this._apiUserService.getUsers()
  }

  public createNewUser() {}

  public deleteUser(id: number) {
    this._modalService
      .open(ConfirmModalComponent, {
        title: 'Are you sure you want to remove the user?',
      })
      .instance.result.pipe(
        switchMap((result) => {
          if (result === true) {
            return this._apiUserService.deleteUser(id)
          }
          return of(undefined)
        })
      )
      .subscribe({
        error: () => {
          this._modalService.close()
        },
        next: () => {
          this.reloadTrigger$.next()
          this._modalService.close()
        },
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
