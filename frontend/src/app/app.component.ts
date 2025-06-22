import { AfterViewInit, Component, inject, ViewChild } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ModalHostComponent } from './core/modal-host/modal-host.component'
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
export class AppComponent implements AfterViewInit {
  private _modalService = inject(ModalService)

  @ViewChild(ModalHostComponent) modalHost!: ModalHostComponent

  ngAfterViewInit(): void {
    this._modalService.registerHost(this.modalHost)
  }
}
