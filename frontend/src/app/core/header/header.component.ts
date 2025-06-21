import { Component, ElementRef, inject, ViewChild } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { HasPermissionDirective } from '../../directives/has-permission.directive'
import { IsLoggedInDirective } from '../../directives/is-logged-in.directive'
import { AuthService } from '../../services/auth.service'

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
export class HeaderComponent {
  private readonly _router = inject(Router)
  private readonly _authService = inject(AuthService)

  @ViewChild('detailsRef') detailsRef: ElementRef | undefined

  public get loggedUser() {
    return this._authService.getLoggedUser()
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
}
