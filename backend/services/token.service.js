import jwt from 'jsonwebtoken'
import config from '../services/config.service.js'

const secret = config.jwtSecret
const options = {
  expiresIn: config.tokenLifetime,
}

export function generateToken(userId, username, permissionNames) {
  const payload = {
    sub: userId,
    name: username,
    permissions: permissionNames,
  }

  const token = jwt.sign(payload, secret, options)

  return token
}

export function verifyToken(jwtTokenString) {
  try {
    return jwt.verify(jwtTokenString, secret, options)
  } catch (err) {
    console.error({ err })
    return null
  }
}
