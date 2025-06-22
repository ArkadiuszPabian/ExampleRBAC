import {
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { PermissionRefresherService } from '../services/permission-refresher.service'

@Directive({
  selector: '[appIsLoggedIn]',
})
export class IsLoggedInDirective implements OnInit, OnDestroy {
  private readonly _templateRef = inject(TemplateRef)
  private readonly _viewContainer = inject(ViewContainerRef)
  private readonly _authService = inject(AuthService)
  private readonly _permissionRefresher = inject(PermissionRefresherService)
  private readonly _subscription = new Subscription()

  @Input('appIsLoggedIn')
  public expectedState = true

  ngOnInit(): void {
    this._subscription.add(
      this._permissionRefresher.permissionChanged$.subscribe(() => {
        this.updateView(!this._authService.hasTokenExpired())
      })
    )
  }

  private updateView(state: boolean) {
    this._viewContainer.clear()
    if (state === this.expectedState) {
      this._viewContainer.createEmbeddedView(this._templateRef)
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
