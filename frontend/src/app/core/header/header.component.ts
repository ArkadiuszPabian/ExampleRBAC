import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IsLoggedInDirective } from '../../directives/is-logged-in.directive';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    IsLoggedInDirective
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly _router = inject(Router)
  private readonly _authService = inject(AuthService)

  public navToSignIn() {
    this._router.navigate(['sign-in'])
  }

  public signOut() {
    this._authService.logout()
  }
}
