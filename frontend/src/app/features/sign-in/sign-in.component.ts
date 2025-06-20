import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-sign-in',
  imports: [
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit, AfterViewInit, OnDestroy {
  private _subscription = new Subscription()
  private _authService = inject(AuthService)
  private _formBuilder = inject(FormBuilder)
  private _router = inject(Router)

  @ViewChild('username') username!: ElementRef

  public form!: FormGroup
  public validationErrorMsg: string | undefined

  public get usernameField() {
    return this.form.get('username')
  }

  public get passwordField() {
    return this.form.get('password')
  }

  public get isUsernameInvalid() {
    return (this.usernameField?.dirty && this.usernameField?.invalid) === true
      ? true
      : undefined
  }

  public get isPasswordInvalid() {
    return (this.passwordField?.dirty && this.passwordField?.invalid) === true
      ? true
      : undefined
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngAfterViewInit() {
    queueMicrotask(() => this.username.nativeElement.focus())
  }

  public signIn() {
    this.validationErrorMsg = undefined
    this.usernameField?.markAsDirty()
    this.passwordField?.markAsDirty()

    if (!this.usernameField || this.usernameField.invalid) {
      this.validationErrorMsg = 'Username is required'
      return
    }

    if (!this.passwordField || this.passwordField.invalid) {
      this.validationErrorMsg = 'Password is required'
      return
    }

    const username = this.usernameField.value
    const password = this.passwordField.value

    this.form.disable()
    this._subscription.add(
      this._authService.login(username, password).subscribe({
        next: (response) => {
          if (response === true) {
            this._router.navigate([''])
          } else {
            this.validationErrorMsg = response
          }
        },
        complete: () => {
          this.form.enable()
          this.username.nativeElement.focus()
        },
      })
    )
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
