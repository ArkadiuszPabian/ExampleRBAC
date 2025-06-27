import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HeaderComponent } from '../header/header.component'

@Component({
  selector: 'app-content',
  imports: [
    RouterOutlet,
    HeaderComponent,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {}
