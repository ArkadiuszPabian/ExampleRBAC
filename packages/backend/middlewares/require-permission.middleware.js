import { getAccessTokenFromHeader } from '../services/auth.service.js'
import * as dbRolesService from '../services/db-roles.service.js'
import * as dbUsersService from '../services/db-users.service.js'

export function requirePermission(permission) {
  return async (request, response, next) => {
    const decodedToken = getAccessTokenFromHeader(request)
    if (decodedToken === null) {
      return response.status(401).send({ reason: 'Unauthorized' })
    }

    const userId = decodedToken.sub
    const shouldReturnDeletedRecords = false
    const user = await dbUsersService.get(userId, shouldReturnDeletedRecords)

    if (user === null) {
      return response.status(403).send({ reason: 'Permission denied' })
    }

    const roleId = user.roleId

    const roleExists = await dbRolesService.exists(roleId)

    if (!roleExists) {
      return response.status(403).send({ reason: 'Permission denied' })
    }

    const hasPermission = await dbRolesService.hasPermission(roleId, permission)

    if (hasPermission === false) {
      return response.status(403).send({ reason: 'Permission denied' })
    }

    next()
  }
}
