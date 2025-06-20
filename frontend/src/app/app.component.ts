import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import { RouterOutlet } from '@angular/router'
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
export class AppComponent implements OnInit, AfterViewInit {
  private _authService = inject(AuthService)
  private _modalService = inject(ModalService)

  ngOnInit(): void {
    this._authService.initialize()
  }

  @ViewChild(ModalHostComponent) modalHost!: ModalHostComponent

  ngAfterViewInit(): void {
    this._modalService.registerHost(this.modalHost)
  }
}
