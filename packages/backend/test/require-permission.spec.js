import { describe, it, jest } from '@jest/globals'
import request from 'supertest'

import { requirePermission } from '../middlewares/require-permission.middleware.js'

import * as tokenService from '../services/token.service.js'

import app from '../app.js'

jest.mock('../services/token.service.js')

beforeEach(() => {
  tokenService.verifyAccessToken.mockClear()
})

const url = '/test'

app.get(url, requirePermission('view:test'), (request, response) =>
  response.status(200).send()
)

describe('requirePermission middleware', () => {
  it('should return Unauthorized if token does not exist in a header', async () => {
    const res = await request(app).get(url).send()

    expect(res.statusCode).toBe(401)
    expect(res.body.reason).toBe('Unauthorized')
  })

  it('should return Unathorized if header token is not a bearer', async () => {
    const res = await request(app)
      .get(url)
      .set('Authorization', 'Basic token')
      .send()

    expect(res.statusCode).toBe(401)
    expect(res.body.reason).toBe('Unauthorized')
  })

  it('should return Unauthorized if token cannot be verified', async () => {
    tokenService.verifyAccessToken.mockReturnValue(null)

    const res = await request(app)
      .get(url)
      .set('Authorization', 'Bearer token')
      .send()

    expect(res.statusCode).toBe(401)
    expect(res.body.reason).toBe('Unauthorized')
  })

  it('should return Forbidden if user has no permission to access the resource', async () => {
    tokenService.verifyAccessToken.mockReturnValue({
      sub: 1,
      permissions: [],
    })

    const res = await request(app)
      .get(url)
      .set('Authorization', 'Bearer token')
      .send()

    expect(res.statusCode).toBe(403)
    expect(res.body.reason).toBe('Permission denied')
  })

  it('should proceed if the user has permission to access the resource', async () => {
    tokenService.verifyAccessToken.mockReturnValue({
      sub: 1,
      permissions: ['view:test'],
    })

    const res = await request(app)
      .get(url)
      .set('Authorization', 'Bearer token')
      .send()

    expect(res.statusCode).toBe(200)
  })
})
