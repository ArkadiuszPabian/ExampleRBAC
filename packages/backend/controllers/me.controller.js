import config from '../services/config.service.js'
import * as tokenService from '../services/token.service.js'

export async function getMyInfoAction(request, response) {
  const cookieToken = request.cookies[config.authCookieName]
  if (!cookieToken) {
    return response.status(401).send({ reason: 'Unauthorized' })
  }

  const token = tokenService.verifyToken(cookieToken)

  if (token === null) {
    return response.status(403).send({ reason: 'Permission denied' })
  }

  const myInfo = {
    id: token.sub,
    name: token.name,
    permissions: token.permissions,
  }

  response.status(200).send(myInfo)
}
