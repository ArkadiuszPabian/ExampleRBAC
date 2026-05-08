import { describe, expect, it, jest } from '@jest/globals'
import request from 'supertest'

import * as dbRolesService from '../services/db-roles.service.js'
import * as dbUsersService from '../services/db-users.service.js'
import * as hashService from '../services/hash.service.js'

import app from '../app.js'

jest.mock('../services/db-users.service.js')
jest.mock('../services/db-roles.service.js')
jest.mock('../services/hash.service.js')
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
jest.mock('../middlewares/require-permission.middleware.js', () => ({
  requirePermission: function (_permission) {
    return async (_request, _response, next) => next()
  },
}))

beforeEach(() => {
  hashService.hashPassword.mockClear()
  dbRolesService.exists.mockClear()
  dbUsersService.getAll.mockClear()
  dbUsersService.get.mockClear()
  dbUsersService.create.mockClear()
  dbUsersService.update.mockClear()
  dbUsersService.remove.mockClear()
  dbUsersService.exists.mockClear()
  dbUsersService.getUserByUsername.mockClear()
})

const url = '/api/users'

describe('GET /users', () => {
  it('should return all existing users', async () => {
    dbUsersService.getAll.mockResolvedValue([
      {
        dataValues: { id: 1 },
      },
      {
        dataValues: { id: 2 },
      },
      {
        dataValues: { id: 3 },
      },
    ])

    const res = await request(app).get(url).send({})

    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(3)
  })

  it('should NOT include hashed password in a response', async () => {
    dbUsersService.getAll.mockResolvedValue([
      {
        dataValues: {
          id: 1,
        },
      },
    ])

    const res = await request(app).get(url).send({})

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([{ id: 1, roleName: '' }])
  })
})

describe('POST /users', () => {
  it('should return Bad Request if username was not provided in new user', async () => {
    const res = await request(app).post(url).send({})

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Username not provided')
  })

  it('should return Bad Request if password was not provided in new user', async () => {
    const res = await request(app).post(url).send({
      username: 'username',
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Password not provided')
  })

  it('should return Bad Request if roleId was not provided in new user', async () => {
    const res = await request(app).post(url).send({
      username: 'username',
      password: 'password',
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Role id not provided')
  })

  it('should return Conflict if the user already exists in database', async () => {
    dbUsersService.exists.mockResolvedValue(true)

    const res = await request(app).post(url).send({
      username: 'username',
      password: 'password',
      roleId: 1,
    })

    expect(res.statusCode).toBe(409)
    expect(res.body.reason).toBe('User with provided username already exists')
  })

  it('should return Bad Request if role with given id was not found in database', async () => {
    dbUsersService.exists.mockResolvedValue(false)
    dbRolesService.exists.mockResolvedValue(false)

    const res = await request(app).post(url).send({
      username: 'username',
      password: 'password',
      roleId: 1,
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Provided role not found')
  })

  it('should return Internal Server Error if there was an internal error in hashing of password', async () => {
    dbUsersService.exists.mockResolvedValue(false)
    dbRolesService.exists.mockResolvedValue(true)
    hashService.hashPassword.mockResolvedValue(null)

    const res = await request(app).post(url).send({
      username: 'username',
      password: 'password',
      roleId: 1,
    })

    expect(res.statusCode).toBe(500)
    expect(res.body.reason).toBe('Internal Server Error')
  })

  it('should create new user and return it without hashed password', async () => {
    const user = {
      userId: 1,
      username: 'username',
      hashedPassword: 'hash',
      roleId: 1,
      isActivated: false,
    }

    dbUsersService.exists.mockResolvedValue(false)
    dbRolesService.exists.mockResolvedValue(true)
    hashService.hashPassword.mockResolvedValue('hash')
    dbUsersService.create.mockResolvedValue(user)

    const res = await request(app).post(url).send({
      username: 'username',
      password: 'password',
      roleId: 1,
    })

    expect(res.statusCode).toBe(201)
    delete user.hashedPassword
    expect(res.body).toEqual(user)
  })
})

describe('PUT /users/:id', () => {
  const urlWithId = url + '/1'

  it('should return Not Found if id was not provided for update of user', async () => {
    const res = await request(app).put(url).send({})

    expect(res.statusCode).toBe(404)
  })

  it('should return Bad Request if username was not provided for update of user', async () => {
    const res = await request(app).put(urlWithId).send({})

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Role id not provided')
  })

  it('should return Bad Request if password was not provided for update of user', async () => {
    const res = await request(app).put(urlWithId).send({
      username: 'username',
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Role id not provided')
  })

  it('should return Bad Request if roleId was not provided for update of user', async () => {
    const res = await request(app).put(urlWithId).send({
      username: 'username',
      password: 'password',
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Role id not provided')
  })

  it('should return Not Found if user with given id does not exist', async () => {
    dbUsersService.get.mockResolvedValue(null)

    const res = await request(app).put(urlWithId).send({
      username: 'username',
      password: 'password',
      roleId: 1,
    })

    expect(res.statusCode).toBe(404)
    expect(res.body.reason).toBe('User not found')
  })

  it('should return Bad Request if there is no role with roleId in database', async () => {
    dbUsersService.get.mockResolvedValue({})
    dbRolesService.exists.mockResolvedValue(false)

    const res = await request(app).put(urlWithId).send({
      username: 'username',
      password: 'password',
      roleId: 1,
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Provided role not found')
  })

  it('should return Internal Server Error if there was an internal error in hashing of password', async () => {
    dbUsersService.get.mockResolvedValue({})
    dbRolesService.exists.mockResolvedValue(true)
    hashService.hashPassword.mockResolvedValue(null)

    const res = await request(app).put(urlWithId).send({
      username: 'username',
      password: 'password',
      roleId: 1,
    })

    expect(res.statusCode).toBe(500)
    expect(res.body.reason).toBe('Internal Server Error')
  })

  it('should update user and return it without hashed password', async () => {
    const user = {
      userId: 1,
      username: 'username',
      hashedPassword: 'hash',
      roleId: 1,
      isActivated: false,
    }

    dbUsersService.get.mockResolvedValue({ dataValues: {} })
    dbRolesService.exists.mockResolvedValue(true)
    hashService.hashPassword.mockResolvedValue('hash')
    dbUsersService.update.mockResolvedValue({
      dataValues: {
        ...user,
        hashedPassword: 'hash',
        Role: { roleName: '' },
      },
    })

    const res = await request(app).put(urlWithId).send({
      username: 'username',
      password: 'password',
      roleId: 1,
    })

    expect(res.statusCode).toBe(200)
    delete user.hashedPassword
    expect(res.body).toEqual({ ...user, roleName: '' })
  })
})

describe('DELETE /users/:id', () => {
  const urlWithId = url + '/1'

  it('should return Not Found if id was not provided for deletion of user', async () => {
    const res = await request(app).delete(url).send({})

    expect(res.statusCode).toBe(404)
  })

  it('should return Not Found if user with given id does not exist', async () => {
    dbUsersService.remove.mockResolvedValue(null)
    const res = await request(app).delete(urlWithId).send({})

    expect(res.statusCode).toBe(404)
    expect(res.body.reason).toBe('User not found')
  })

  it('should delete existing user', async () => {
    dbUsersService.remove.mockResolvedValue(true)
    const res = await request(app).delete(urlWithId).send({})

    expect(dbUsersService.remove).toHaveBeenCalledWith(1)
    expect(res.statusCode).toBe(204)
  })
})
