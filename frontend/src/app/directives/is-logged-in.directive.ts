import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appIsLoggedIn]'
})
export class IsLoggedInDirective implements OnInit, OnDestroy {
  private _templateRef = inject(TemplateRef)
  private _viewContainer = inject(ViewContainerRef)
  private _authService = inject(AuthService)
  private _subscription = new Subscription()

  @Input('appIsLoggedIn')
  public expectedState = true

  ngOnInit(): void {
    this._subscription.add(
      this._authService.isLoggedIn$().subscribe((state) => {
        this.updateView(state)
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
