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
import { Permission } from '../models/permission.model'
import { AuthService } from '../services/auth.service'
import { PermissionRefresherService } from '../services/permission-refresher.service'

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private readonly _templateRef = inject(TemplateRef)
  private readonly _viewContainer = inject(ViewContainerRef)
  private readonly _authService = inject(AuthService)
  private readonly _permissionRefresher = inject(PermissionRefresherService)
  private readonly _subscription = new Subscription()

  @Input({
    alias: 'appHasPermission',
    required: true,
  })
  public permission!: Permission

  ngOnInit(): void {
    this._subscription.add(
      this._permissionRefresher.permissionChanged$.subscribe((_state) => {
        console.debug(this.permission)
        this.updateView()
      })
    )
  }

  private updateView() {
    this._viewContainer.clear()
    if (this._authService.hasPermission(this.permission)) {
      this._viewContainer.createEmbeddedView(this._templateRef)
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
