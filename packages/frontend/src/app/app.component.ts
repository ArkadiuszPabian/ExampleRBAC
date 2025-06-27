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
import { ApiMeService } from './services/api-me.service'
import { MeService } from './services/me.service'
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
  private readonly _meService = inject(MeService)
  private readonly _apiMeService = inject(ApiMeService)
  private readonly _subscription = new Subscription()

  @ViewChild(ModalHostComponent) modalHost!: ModalHostComponent

  ngOnInit(): void {
    this._subscription.add(
      this._apiMeService.getMyInfo().subscribe({
        next: (myInfo) => {
          this._meService.set(myInfo)
        },
      })
    )
  }

  ngAfterViewInit(): void {
    this._modalService.registerHost(this.modalHost)
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
}
