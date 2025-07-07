import { ComponentFixture, TestBed } from '@angular/core/testing'

import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideRouter } from '@angular/router'
import { ContentComponent } from './content.component'

describe('ContentComponent', () => {
  let component: ContentComponent
  let fixture: ComponentFixture<ContentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ContentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
