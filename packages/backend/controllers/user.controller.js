import * as dbRolesService from '../services/db-roles.service.js'
import * as dbUsersService from '../services/db-users.service.js'
import * as hashService from '../services/hash.service.js'

function toSafeUser(dbUser) {
  if (dbUser === null) {
    return null
  }
  const { Role, ...rest } = dbUser.dataValues
  return {
    ...rest,
    roleName: Role?.roleName ?? '',
  }
}

export async function getSingleUserAction(request, response) {
  const userId = Number(request.params.id)

  const shouldReturnDeletedRecords = true
  const user = await dbUsersService.get(userId, shouldReturnDeletedRecords)

  response.status(200).send(toSafeUser(user))
}

export async function getUsersAction(_request, response) {
  const shouldReturnDeletedRecords = true
  const users = await dbUsersService.getAll(shouldReturnDeletedRecords)

  response.status(200).send(users.map(toSafeUser))
}

export async function createUserAction(request, response) {
  if (request.body.username === undefined) {
    return response.status(400).send({ reason: 'Username not provided' })
  }

  if (request.body.password === undefined) {
    return response.status(400).send({ reason: 'Password not provided' })
  }

  if (request.body.roleId === undefined) {
    return response.status(400).send({ reason: 'Role id not provided' })
  }

  const username = request.body.username

  // count also deleted records; used to determine if user can be created
  // for data consistency, we can't create second row with same usename
  // even if first one was deleted
  const shouldReturnDeletedRecords = true
  const doesUserExist = await dbUsersService.exists(
    username,
    shouldReturnDeletedRecords
  )

  if (doesUserExist === true) {
    return response
      .status(409)
      .send({ reason: 'User with provided username already exists' })
  }

  const roleId = request.body.roleId

  const doesRoleExist = await dbRolesService.exists(roleId)

  if (doesRoleExist === false) {
    return response.status(400).send({ reason: 'Provided role not found' })
  }

  const password = request.body.password
  const hashedPassword = await hashService.hashPassword(password)

  if (hashedPassword === null) {
    return response.status(500).send({ reason: 'Internal Server Error' })
  }

  const isActivated = request.body.isActivated === true

  const createdUser = await dbUsersService.create(
    username,
    hashedPassword,
    roleId,
    isActivated
  )

  const { hashedPassword: _, ...safeUser } = createdUser
  response.status(201).send(safeUser)
}

export async function updateUserAction(request, response) {
  if (request.body.roleId === undefined) {
    return response.status(400).send({ reason: 'Role id not provided' })
  }

  const userId = Number(request.params.id)

  const shouldReturnDeletedRecords = false
  const user = await dbUsersService.get(userId, shouldReturnDeletedRecords)

  if (user === null) {
    return response.status(404).send({ reason: 'User not found' })
  }

  const roleId = request.body.roleId

  const doesRoleExist = await dbRolesService.exists(roleId)

  if (doesRoleExist === false) {
    return response.status(400).send({ reason: 'Provided role not found' })
  }

  const password = request.body.password
  let hashedPassword
  if (password !== undefined) {
    hashedPassword = await hashService.hashPassword(password)

    if (hashedPassword === null) {
      return response.status(500).send({ reason: 'Internal Server Error' })
    }
  }

  const isActivated = request.body.isActivated === true

  const createdUser = await dbUsersService.update(
    userId,
    hashedPassword,
    roleId,
    isActivated,
    shouldReturnDeletedRecords
  )

  response.status(200).send(toSafeUser(createdUser))
}

export async function deleteUserAction(request, response) {
  const userId = Number(request.params.id)

  const deleteResult = await dbUsersService.remove(userId)

  if (deleteResult !== true) {
    return response.status(404).send({ reason: 'User not found' })
  }

  response.status(204).send()
}
