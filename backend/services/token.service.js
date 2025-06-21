import jwt from 'jsonwebtoken'

export const tokenLifetimeInSeconds = 15 * 60 // 15 min

const secret = 'secret'
const options = {
  expiresIn: tokenLifetimeInSeconds,
}

export function generateToken(userId, username, permissionNames) {
  const timestamp = Date.now()

  const payload = {
    sub: userId,
    iat: timestamp,
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
    return null
  }
}
