import jwt from 'jsonwebtoken'
import config from './config.service.js'

const accessTokenSecret = config.accessTokenSecret
const refreshTokenSecret = config.refreshTokenSecret

const accessTokenOptions = {
  expiresIn: config.accessTokenLifetime,
}

const refreshTokenOptions = {
  expiresIn: config.refreshTokenLifetime,
}

export function generateAccessToken(userId, username, permissionNames) {
  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not configured')
  }
  const payload = {
    sub: userId,
    name: username,
    permissions: permissionNames,
  }

  const token = jwt.sign(payload, accessTokenSecret, accessTokenOptions)

  return token
}

export function generateRefreshToken(userId) {
  if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not configured')
  }
  const payload = {
    sub: userId,
  }

  const token = jwt.sign(payload, refreshTokenSecret, refreshTokenOptions)

  return token
}

export function verifyAccessToken(jwtTokenString) {
  try {
    return jwt.verify(jwtTokenString, accessTokenSecret, accessTokenOptions)
  } catch (err) {
    console.error({ err })
    return null
  }
}

export function verifyRefreshToken(jwtTokenString) {
  try {
    return jwt.verify(jwtTokenString, refreshTokenSecret, refreshTokenOptions)
  } catch (err) {
    console.error({ err })
    return null
  }
}
