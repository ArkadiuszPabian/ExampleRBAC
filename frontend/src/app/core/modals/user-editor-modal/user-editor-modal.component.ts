import { NgFor, NgIf } from '@angular/common'
import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { map, startWith, Subscription, switchMap } from 'rxjs'
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

  public get isEditing() {
    return !!this.id
  }

  ngOnInit(): void {
    if (this.isEditing) {
      this._subscription.add(
        this._apiUserService
          .getSingleUser(this.id!)
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
              passwordFieldEnabled: [false],
              password: [''],
              isActivated: [user.isActivated],
              roleId: [user.roleId, [Validators.required]],
            })

            const passwordFieldEnabled = this.form.get('passwordFieldEnabled')!
            const password = this.form.get('password')!

            passwordFieldEnabled.valueChanges
              .pipe(startWith(password.value))
              .subscribe((checked: boolean) => {
                checked ? password.enable() : password.disable()
              })

            this.roles = roles
            this.isLoading = false
          })
      )
    } else {
      this._subscription.add(
        this._apiRoleService.getRoles().subscribe((roles) => {
          this.form = this._formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
            isActivated: [false],
            roleId: [
              roles[0]?.id,
              [Validators.required],
            ],
          })

          this.roles = roles
          this.isLoading = false
        })
      )
    }
  }

  public get title() {
    return this.isEditing === false ? 'Create new user' : 'Edit user'
  }

  @Input() id?: number

  @Output() result = new EventEmitter<DTOEditUser | null>()

  save() {
    let password = this.form.get('password')?.value
    if (this.isEditing) {
      const passwordFieldEnabled = this.form.get('passwordFieldEnabled')?.value
      if (passwordFieldEnabled !== true) {
        password = undefined
      }
    }

    const user: DTOEditUser = {
      username: this.form.get('username')?.value,
      password,
      isActivated: this.form.get('isActivated')?.value,
      roleId: this.form.get('roleId')?.value,
    }

    this.result.emit(user)
  }

  cancel() {
    this.result.emit(null)
  }
}
