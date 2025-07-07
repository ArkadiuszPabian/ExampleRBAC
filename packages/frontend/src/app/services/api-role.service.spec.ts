import { TestBed } from '@angular/core/testing'

import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ApiRoleService } from './api-role.service'

describe('ApiRoleService', () => {
  let service: ApiRoleService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
    service = TestBed.inject(ApiRoleService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
