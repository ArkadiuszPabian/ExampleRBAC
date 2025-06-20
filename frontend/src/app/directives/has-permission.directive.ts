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

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private _templateRef = inject(TemplateRef)
  private _viewContainer = inject(ViewContainerRef)
  private _authService = inject(AuthService)
  private _subscription = new Subscription()

  @Input({
    alias: 'appHasPermission',
    required: true,
  })
  public permission!: Permission

  ngOnInit(): void {
    this._subscription.add(
      this._authService.isLoggedIn$().subscribe((state) => {
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
