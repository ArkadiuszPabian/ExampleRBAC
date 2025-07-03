import * as tokenService from '../services/token.service.js'

export function getAccessTokenFromHeader(request) {
  const accessTokenHeader = request.get('Authorization')

  if (!accessTokenHeader) {
    return null
  }

  const rawAccessToken = accessTokenHeader.substring('Bearer '.length)

  const decodedToken = tokenService.verifyAccessToken(rawAccessToken)

  if (decodedToken === null) {
    return null
  }

  return decodedToken
}
