import { TestBed } from '@angular/core/testing'

import { ApiPermissionService } from './api-permission.service'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

describe('ApiPermissionService', () => {
  let service: ApiPermissionService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
    service = TestBed.inject(ApiPermissionService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
