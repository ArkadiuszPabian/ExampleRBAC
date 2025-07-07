import { TestBed } from '@angular/core/testing'

import { ApiAuthService } from './api-auth.service'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

describe('ApiAuthService', () => {
  let service: ApiAuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
    service = TestBed.inject(ApiAuthService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
