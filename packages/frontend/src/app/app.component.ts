import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Subscription } from 'rxjs'
import { ModalHostComponent } from './core/modal-host/modal-host.component'
import { AuthService } from './services/auth.service'
import { ModalService } from './services/modal.service'

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ModalHostComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly _modalService = inject(ModalService)
  private readonly _authService = inject(AuthService)
  private readonly _subscription = new Subscription()

  @ViewChild(ModalHostComponent) modalHost!: ModalHostComponent

  ngOnInit(): void {
    this._subscription.add(
      this._authService.restoreSession().subscribe()
    )
  }

  ngAfterViewInit(): void {
    this._modalService.registerHost(this.modalHost)
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
