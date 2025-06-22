import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Subscription } from 'rxjs'
import { HasPermissionDirective } from '../../directives/has-permission.directive'
import { IsLoggedInDirective } from '../../directives/is-logged-in.directive'
import { AuthService } from '../../services/auth.service'
import { MeService } from '../../services/me.service'

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    IsLoggedInDirective,
    HasPermissionDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly _router = inject(Router)
  private readonly _authService = inject(AuthService)
  private readonly _meService = inject(MeService)
  private readonly _subscription = new Subscription()

  @ViewChild('detailsRef') detailsRef: ElementRef | undefined

  public loggedUser: string | undefined

  ngOnInit(): void {
    this.loggedUser = this._authService.getLoggedUser()
    this._subscription.add(
      this._meService._me$.subscribe({
        next: () => {
          this.loggedUser = this._authService.getLoggedUser()
        },
      })
    )
  }

  public closeMenu() {
    this.detailsRef?.nativeElement.removeAttribute('open')
  }

  public navToRolesPage() {
    this._router.navigate(['roles/edit'])
    this.closeMenu()
  }

  public navToUsersPage() {
    this._router.navigate(['users/edit'])
    this.closeMenu()
  }

  public navToSignIn() {
    this._router.navigate(['sign-in'])
  }

  public signOut() {
    this._authService.logout()
    this.closeMenu()
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
