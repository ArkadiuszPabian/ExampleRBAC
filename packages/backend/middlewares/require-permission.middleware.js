import { getAccessTokenFromHeader } from '../services/auth.service.js'
import * as dbUsersService from '../services/db-users.service.js'

export function requirePermission(permission) {
  return async (request, response, next) => {
    const decodedToken = getAccessTokenFromHeader(request)
    if (decodedToken === null) {
      return response.status(401).send({ reason: 'Unauthorized' })
    }

    // Re-check the user record on every privileged request so that account
    // deletion or deactivation takes effect immediately, instead of waiting
    // for the access token (15m) to expire.
    const shouldReturnDeletedRecords = false
    const user = await dbUsersService.get(
      decodedToken.sub,
      shouldReturnDeletedRecords
    )
    if (user === null || user.isActivated !== true) {
      return response.status(401).send({ reason: 'Unauthorized' })
    }

    if ((decodedToken.permissions ?? []).includes(permission) !== true) {
      return response.status(403).send({ reason: 'Permission denied' })
    }

    next()
  }
}
