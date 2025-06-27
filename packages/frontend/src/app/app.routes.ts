import { Routes } from '@angular/router'
import { CenterContentComponent } from './core/center-content/center-content.component'
import { ContentComponent } from './core/content/content.component'
import { ArticleListComponent } from './features/article-list/article-list.component'
import { RoleListComponent } from './features/role-list/role-list.component'
import { SignInComponent } from './features/sign-in/sign-in.component'
import { UserListComponent } from './features/user-list/user-list.component'
import { authLoginRedirectGuard } from './guards/auth-login-redirect.guard'
import { permissionRedirectGuard } from './guards/permission-redirect.guard'

export const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      {
        path: '',
        component: ArticleListComponent,
      },
      {
        path: 'users/edit',
        canActivate: [
          permissionRedirectGuard('view:users'),
        ],
        component: UserListComponent,
      },
      {
        path: 'roles/edit',
        canActivate: [
          permissionRedirectGuard('view:roles'),
        ],
        component: RoleListComponent,
      },
    ],
  },
  {
    path: 'sign-in',
    canActivate: [
      authLoginRedirectGuard,
    ],
    component: CenterContentComponent,
    children: [
      {
        path: '',
        component: SignInComponent,
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
]
