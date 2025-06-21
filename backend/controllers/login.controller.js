import * as dbRolesService from '../services/db-roles.service.js'
import * as dbUsersService from '../services/db-users.service.js'
import * as hashService from '../services/hash.service.js'
import * as tokenService from '../services/token.service.js'

/**
 * Action used to log in the user.
 */
export async function loginAction(request, response) {
  if (request.body.username === undefined) {
    return response.status(400).send({
      reason: 'Username not provided',
    })
  }

  if (request.body.password === undefined) {
    return response.status(400).send({
      reason: 'Password not provided',
    })
  }

  // We skip other validation intentionally, for simplicity -
  // for production app, we should have validation service that makes sure
  // provided data comply with our validation rules

  const { username, password } = request.body

  const shouldReturnDeletedRecords = false
  const user = await dbUsersService.getUserByUsername(
    username,
    shouldReturnDeletedRecords
  )

  if (user === null) {
    return response.status(401).send({
      reason: 'Invalid username and / or password',
    })
  }

  if (user.isActivated !== true) {
    return response.status(401).send({
      reason: 'Account is not activated',
    })
  }

  const passwordVerified = await hashService.verifyPassword(
    password,
    user.hashedPassword
  )

  if (passwordVerified === null) {
    return response.status(500).send({
      reason: 'Internal Server Error',
    })
  }

  if (passwordVerified === false) {
    return response.status(401).send({
      reason: 'Invalid username and / or password',
    })
  }

  const permissions = await dbRolesService.getPermissions(user.roleId)

  const permissionNames = permissions.map(
    (permission) => permission.dataValues.permissionName
  )

  const token = tokenService.generateToken(user.id, username, permissionNames)

  response
    .status(204)
    .cookie('access_token', token, {
      httpOnly: false, // prevents JS access on client side
      secure: false, // true if using HTTPS
      sameSite: 'strict', // prevent CSRF
      maxAge: 1000 * tokenService.tokenLifetimeInSeconds,
    })
    .send()
}
