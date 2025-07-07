import { TestBed } from '@angular/core/testing'

import { ApiMeService } from './api-me.service'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

describe('ApiMeService', () => {
  let service: ApiMeService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
    service = TestBed.inject(ApiMeService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
