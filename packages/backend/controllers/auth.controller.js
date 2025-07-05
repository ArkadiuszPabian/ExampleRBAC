import config from '../services/config.service.js'
import cookieService from '../services/cookie.service.js'
import * as dbRefreshTokenService from '../services/db-refresh-token.service.js'
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

  const accessToken = tokenService.generateAccessToken(
    user.id,
    username,
    permissionNames
  )

  const refreshToken = tokenService.generateRefreshToken(user.id)

  const sessionStart = new Date()
  await dbRefreshTokenService.store({
    userId: user.id,
    token: refreshToken,
    expiresAt: sessionStart.getTime() + config.refreshTokenLifetimeInMs,
    sessionStartedAt: sessionStart,
  })

  response = cookieService.setCookie(
    config.refreshTokenCookieName,
    response,
    refreshToken
  )

  response.status(200).send({ accessToken })
}

export async function logoutAction(request, response) {
  const cookie = cookieService.getCookie(config.refreshTokenCookieName, request)

  if (cookie !== undefined) {
    response = cookieService.clearCookie(
      config.refreshTokenCookieName,
      response
    )
  }

  response.status(204).send()
}

export async function rotateRefreshTokenAction(request, response) {
  const oldRefreshToken = cookieService.getCookie(
    config.refreshTokenCookieName,
    request
  )
  response.set('X-Refreshed', 'true')

  if (!oldRefreshToken) {
    return response.status(401).send({ reason: 'Unauthorized' })
  }

  const existingToken =
    await dbRefreshTokenService.getExistingTokenEntry(oldRefreshToken)

  if (!existingToken || existingToken.revoked) {
    return response
      .status(401)
      .send({ reason: 'Refresh token invalid or revoked' })
  }

  if (new Date() > new Date(existingToken.expiresAt)) {
    return response.status(401).send({ reason: 'Refresh token expired' })
  }

  const maxSessionDurationMs = config.loginSessionLifetimeInMs
  const sessionStart = existingToken.sessionStartedAt
  const now = new Date()
  if (now.getTime() > sessionStart.getTime() + maxSessionDurationMs) {
    return response.status(401).send({ reason: 'Session expired' })
  }

  const isRevoked = await dbRefreshTokenService.revokeToken(existingToken.id)

  if (isRevoked === false) {
    return response.status(500).send({ reason: 'Internal Server Error' })
  }

  if (existingToken.replacedByTokenId) {
    return response.status(401).send({ reason: 'Token reuse detected' })
  }

  const newRefreshToken = await tokenService.generateRefreshToken(
    existingToken.userId
  )

  await dbRefreshTokenService.store({
    userId: existingToken.userId,
    token: newRefreshToken,
    expiresAt: sessionStart.getTime() + config.refreshTokenLifetimeInMs,
    sessionStartedAt: existingToken.sessionStartedAt,
    parentTokenId: existingToken.id,
  })

  const isReplaced = await dbRefreshTokenService.linkReplacedToken(
    existingToken.id,
    newRefreshToken.id
  )

  if (!isReplaced) {
    return response.status(500).send({ reason: 'Internal Server Error' })
  }

  const newAccessToken = await tokenService.generateAccessToken(
    existingToken.userId
  )

  cookieService.setCookie(
    config.refreshTokenCookieName,
    response,
    newAccessToken
  )

  return response.status(200).send({ accessToken: newAccessToken })
}

export async function status(_request, response) {
  response.status(204).send()
}
