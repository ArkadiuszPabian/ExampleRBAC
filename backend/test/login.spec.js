import { jest } from '@jest/globals'
import request from 'supertest'

import * as dbUsersService from '../services/db-users.service.js'
import * as hashService from '../services/hash.service.js'
import * as tokenService from '../services/token.service.js'

import app from '../app.js'

jest.mock('../services/db-users.service.js')
jest.mock('../services/hash.service.js')
jest.mock('../services/token.service.js')

describe('POST /login', () => {
  const url = '/login'

  beforeEach(() => {
    hashService.verifyPassword.mockClear()
    dbUsersService.getUserByUsername.mockClear()
    tokenService.generateToken.mockClear()
  })

  it('should return Bad Request if no username was provided', async () => {
    const res = await request(app).post(url).send({ username: undefined })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Username not provided')
  })

  it('should return Bad Request if no password was provided', async () => {
    const res = await request(app)
      .post(url)
      .send({ username: 'some-user', password: undefined })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Password not provided')
  })

  it('should return Unauthorized if non-existent user was provided', async () => {
    dbUsersService.getUserByUsername.mockResolvedValue(null)

    const res = await request(app)
      .post(url)
      .send({ username: 'some-user', password: 'some-password' })

    expect(res.statusCode).toBe(401)
    expect(res.body.reason).toBe('Username and / or password is invalid')
  })

  it('should return Server Error if password cannot be hashed properly', async () => {
    dbUsersService.getUserByUsername.mockResolvedValue({})
    hashService.verifyPassword.mockResolvedValue(null)

    const res = await request(app)
      .post(url)
      .send({ username: 'some-user', password: 'you-wont-hash-me' })

    expect(res.statusCode).toBe(500)
    expect(res.body.reason).toBe('Internal Server Error')
  })

  it('should return Unauthorized if wrong password was provided', async () => {
    dbUsersService.getUserByUsername.mockResolvedValue({})
    hashService.verifyPassword.mockResolvedValue(false)

    const res = await request(app)
      .post(url)
      .send({ username: 'some-user', password: 'wrong-password' })

    expect(res.statusCode).toBe(401)
    expect(res.body.reason).toBe('Username and / or password is invalid')
  })

  it('should return OK if correct user and password were provided', async () => {
    dbUsersService.getUserByUsername.mockResolvedValue({})
    hashService.verifyPassword.mockResolvedValue(true)

    const token = 'test-token'

    tokenService.generateToken.mockReturnValue(token)

    const res = await request(app)
      .post(url)
      .send({ username: 'some-user', password: 'valid-password' })

    expect(res.statusCode).toBe(204)

    const cookies = res.headers['set-cookie']
    expect(cookies).toBeDefined()

    const accessTokenCookie = cookies.find((cookie) =>
      cookie.startsWith('access_token=')
    )
    expect(accessTokenCookie).toBeDefined()

    expect(accessTokenCookie).toContain(`access_token=${token}`)

    expect(accessTokenCookie).toMatch(/HttpOnly/i)

    expect(accessTokenCookie).toMatch(/SameSite=Strict/i)

    expect(accessTokenCookie).not.toMatch(/Secure/i)

    expect(accessTokenCookie).toMatch(/Max-Age=3600/i)
  })
})
