import * as dbRolesService from '../services/db-roles.service.js'

export async function getPermissionsAction(request, response) {
  const roleId = Number(request.params.roleId)

  const permissions = await dbRolesService.getPermissions(roleId)

  const permissionValues = permissions.map(
    (permission) => permission.dataValues
  )

  response.status(200).send(permissionValues)
}
