import * as dbRolesService from '../services/db-roles.service.js'
import * as dbUsersService from '../services/db-users.service.js'
import * as hashService from '../services/hash.service.js'

export async function getUsersAction(_request, response) {
  const users = await dbUsersService.getAll()

  // do not return hashed passwords
  const preparedUsers = users.map(({ hashedPassword, ...rest }) => rest)

  response.status(200).send(preparedUsers)
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

  const doesUserExist = await dbUsersService.exists(username)

  if (doesUserExist === true) {
    return response
      .status(409)
      .send({ reason: 'User with provided username does exist' })
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

  const isActivated = false

  const createdUser = await dbUsersService.create(
    username,
    hashedPassword,
    roleId,
    isActivated
  )

  const { hashedPassword: _, ...safeUser } = createdUser
  response.status(200).send(safeUser)
}

export async function updateUserAction(request, response) {
  if (request.body.username === undefined) {
    return response.status(400).send({ reason: 'Username not provided' })
  }

  if (request.body.password === undefined) {
    return response.status(400).send({ reason: 'Password not provided' })
  }

  if (request.body.roleId === undefined) {
    return response.status(400).send({ reason: 'Role id not provided' })
  }

  const userId = request.params.id

  const user = await dbUsersService.get(userId)

  if (user === null) {
    return response.status(404).send({ reason: 'User not found' })
  }

  const roleId = request.body.roleId

  const doesRoleExist = await dbRolesService.exists(roleId)

  if (doesRoleExist === false) {
    return response.status(400).send({ reason: 'Provided role not found' })
  }

  const username = request.body.username
  const password = request.body.password
  const hashedPassword = await hashService.hashPassword(password)

  if (hashedPassword === null) {
    return response.status(500).send({ reason: 'Internal Server Error' })
  }

  const isActivated = false

  const createdUser = await dbUsersService.update(
    userId,
    username,
    hashedPassword,
    roleId,
    isActivated
  )

  const { hashedPassword: _, ...safeUser } = createdUser
  response.status(200).send(safeUser)
}

export async function deleteUserAction(request, response) {
  const userId = request.params.id

  const deleteResult = await dbUsersService.remove(userId)

  if (deleteResult !== true) {
    return response.status(404).send({ reason: 'User not found' })
  }

  response.status(204).send()
}
