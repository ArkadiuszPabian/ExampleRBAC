import { getAccessTokenFromHeader } from '../services/auth.service.js'

export function requireAccessToken() {
  return async (request, response, next) => {
    const decodedToken = getAccessTokenFromHeader(request)
    if (decodedToken === null) {
      return response.status(401).send({ reason: 'Unauthorized' })
    }

    request.token = decodedToken

    next()
  }
}
