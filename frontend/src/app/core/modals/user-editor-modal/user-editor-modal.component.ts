import { NgFor, NgIf } from '@angular/common'
import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { map, Subscription, switchMap } from 'rxjs'
import { AutofocusAfterInitDirective } from '../../../directives/autofocus-after-init.directive'
import { DTOEditUser } from '../../../models/dto-edit-user.model'
import { DTORole } from '../../../models/dto-role.model'
import { ApiRoleService } from '../../../services/api-role.service'
import { ApiUserService } from '../../../services/api-user.service'

@Component({
  selector: 'app-user-editor-modal',
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    AutofocusAfterInitDirective,
  ],
  templateUrl: './user-editor-modal.component.html',
  styleUrl: './user-editor-modal.component.scss',
})
export class UserEditorModalComponent {
  private readonly _formBuilder = inject(FormBuilder)
  private readonly _apiRoleService = inject(ApiRoleService)
  private readonly _apiUserService = inject(ApiUserService)
  private readonly _subscription = new Subscription()

  public form!: FormGroup
  public isLoading = true
  public roles: DTORole[] = []

  ngOnInit(): void {
    if (this.id) {
      this._subscription.add(
        this._apiUserService
          .getSingleUser(this.id)
          .pipe(
            switchMap((user) =>
              this._apiRoleService
                .getRoles()
                .pipe(map((roles) => ({ user, roles })))
            )
          )
          .subscribe(({ user, roles }) => {
            this.form = this._formBuilder.group({
              username: [user.username, [Validators.required]],
              isActivated: [user.isActivated],
              roleId: [user.roleId],
            })

            console.debug({ user, roles })
            this.roles = roles
            this.isLoading = false
          })
      )
    } else {
      this._subscription.add(
        this._apiRoleService.getRoles().subscribe((roles) => {
          this.form = this._formBuilder.group({
            username: ['', [Validators.required]],
            isActivated: [false],
            roleId: [
              roles && roles.length > 0 ? roles[0].id : -1,
              [Validators.required],
            ],
          })

          console.debug({ roles })
          this.roles = roles
          this.isLoading = false
        })
      )
    }
  }

  public get title() {
    return this.id === undefined ? 'Create new user' : 'Edit user'
  }

  @Input() id?: number

  @Output() result = new EventEmitter<DTOEditUser | null>()

  save() {
    const user: DTOEditUser = {
      username: this.form.get('username')?.value,
      isActivated: this.form.get('isActivated')?.value,
      roleId: this.form.get('roleId')?.value,
    }

    this.result.emit(user)
  }

  cancel() {
    this.result.emit(null)
  }
}
