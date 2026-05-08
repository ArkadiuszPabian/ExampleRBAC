import { jest } from '@jest/globals'
import request from 'supertest'

import * as dbUsersService from '../services/db-users.service.js'
import * as hashService from '../services/hash.service.js'
import * as tokenService from '../services/token.service.js'
import * as dbRolesService from '../services/db-roles.service.js'
import * as dbRefreshTokenService from '../services/db-refresh-token.service.js'

import app from '../app.js'

jest.mock('../services/db-users.service.js')
jest.mock('../services/hash.service.js')
jest.mock('../services/token.service.js')
jest.mock('../services/db-roles.service.js')
jest.mock('../services/db-refresh-token.service.js')
jest.mock('../services/config.service.js', () => ({
  default: {
    refreshTokenCookieName: 'refresh_token',
    refreshTokenLifetimeInMs: 1000,
    loginSessionLifetimeInMs: 1000,
    accessTokenLifetime: '15m',
    refreshTokenLifetime: '7d',
    frontendAddress: 'http://localhost:4200',
    refreshTokenSecret: 'test',
    accessTokenSecret: 'test',
  },
}))

describe('POST /login', () => {
  const url = '/api/auth/login'

  beforeEach(() => {
    hashService.verifyPassword.mockClear()
    dbUsersService.getUserByUsername.mockClear()
    tokenService.generateAccessToken.mockClear()
    tokenService.generateRefreshToken.mockClear()
    dbRolesService.getPermissions.mockClear()
    dbRefreshTokenService.store.mockClear()
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
    expect(res.body.reason).toBe('Invalid username and / or password')
  })

  it('should return Server Error if password cannot be hashed properly', async () => {
    dbUsersService.getUserByUsername.mockResolvedValue({
      isActivated: true,
      hashedPassword: 'hash',
    })
    hashService.verifyPassword.mockResolvedValue(null)

    const res = await request(app)
      .post(url)
      .send({ username: 'some-user', password: 'you-wont-hash-me' })

    expect(res.statusCode).toBe(500)
    expect(res.body.reason).toBe('Internal Server Error')
  })

  it('should return Unauthorized if wrong password was provided', async () => {
    dbUsersService.getUserByUsername.mockResolvedValue({
      isActivated: true,
      hashedPassword: 'hash',
    })
    hashService.verifyPassword.mockResolvedValue(false)

    const res = await request(app)
      .post(url)
      .send({ username: 'some-user', password: 'wrong-password' })

    expect(res.statusCode).toBe(401)
    expect(res.body.reason).toBe('Invalid username and / or password')
  })

  it('should return OK if correct user and password were provided', async () => {
    dbUsersService.getUserByUsername.mockResolvedValue({
      id: 1,
      roleId: 1,
      isActivated: true,
      hashedPassword: 'hash',
    })
    hashService.verifyPassword.mockResolvedValue(true)

    dbRolesService.getPermissions.mockResolvedValue([])

    const accessToken = 'test-access-token'
    const refreshToken = 'test-refresh-token'
    tokenService.generateAccessToken.mockReturnValue(accessToken)
    tokenService.generateRefreshToken.mockReturnValue(refreshToken)
    dbRefreshTokenService.store.mockResolvedValue({ id: 1 })

    const res = await request(app)
      .post(url)
      .send({ username: 'some-user', password: 'valid-password' })

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ accessToken })
  })
})
