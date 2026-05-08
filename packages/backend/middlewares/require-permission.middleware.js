import { getAccessTokenFromHeader } from '../services/auth.service.js'

export function requirePermission(permission) {
  return async (request, response, next) => {
    const decodedToken = getAccessTokenFromHeader(request)
    if (decodedToken === null) {
      return response.status(401).send({ reason: 'Unauthorized' })
    }

    if ((decodedToken.permissions ?? []).includes(permission) !== true) {
      return response.status(403).send({ reason: 'Permission denied' })
    }

    next()
  }
}
