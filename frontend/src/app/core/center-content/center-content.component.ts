import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-center-content',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './center-content.component.html',
  styleUrl: './center-content.component.scss',
})
export class CenterContentComponent {}
