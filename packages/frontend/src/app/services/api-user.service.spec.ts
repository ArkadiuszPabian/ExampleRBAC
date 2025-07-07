import { TestBed } from '@angular/core/testing'

import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ApiUserService } from './api-user.service'

describe('ApiUserService', () => {
  let service: ApiUserService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
    service = TestBed.inject(ApiUserService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
