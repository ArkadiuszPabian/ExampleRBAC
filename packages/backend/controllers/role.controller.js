import * as dbRolesService from '../services/db-roles.service.js'
import * as dbUsersService from '../services/db-users.service.js'
import { isPermissionSupported } from '../services/permission.service.js'

export async function getRolesAction(_request, response) {
  const roles = await dbRolesService.getAll()

  const preparedRoles = roles.map((role) => role.dataValues)

  response.status(200).send(preparedRoles)
}

export async function getSingleRoleAction(request, response) {
  const roleId = Number(request.params.id)

  const role = await dbRolesService.get(roleId)

  const preparedRole = role.dataValues

  response.status(200).send(preparedRole)
}

export async function createRoleAction(request, response) {
  if (request.body.roleName === undefined) {
    return response.status(400).send({ reason: 'Role name not provided' })
  }

  if (request.body.permissions === undefined) {
    return response.status(400).send({ reason: 'Permissions not provided' })
  }

  if (Array.isArray(request.body.permissions) === false) {
    return response
      .status(400)
      .send({ reason: 'Permissions are not an array type' })
  }

  for (const perm of request.body.permissions) {
    if (isPermissionSupported(perm) === false) {
      return response.status(400).send({ reason: 'Permission not supported' })
    }
  }

  const roleName = request.body.roleName
  const permissions = request.body.permissions

  const role = await dbRolesService.create(roleName, permissions)

  if (role === null) {
    return response.status(500).send({ reason: 'Internal Server Error' })
  }

  response.status(201).send(role.dataValues)
}

export async function updateRoleAction(request, response) {
  const roleId = Number(request.params.id)

  if (request.body.roleName === undefined) {
    return response.status(400).send({ reason: 'Role name not provided' })
  }

  if (request.body.permissions === undefined) {
    return response.status(400).send({ reason: 'Permissions not provided' })
  }

  if (Array.isArray(request.body.permissions) === false) {
    return response
      .status(400)
      .send({ reason: 'Permissions are not an array type' })
  }

  for (const perm of request.body.permissions) {
    if (isPermissionSupported(perm) === false) {
      return response.status(400).send({ reason: 'Permission not supported' })
    }
  }

  const roleName = request.body.roleName
  const permissions = request.body.permissions

  const role = await dbRolesService.update(roleId, roleName, permissions)

  if (role === null) {
    return response.status(500).send({ reason: 'Internal Server Error' })
  }

  if (role === false) {
    return response.status(404).send({ reason: 'Role does not exist' })
  }

  response.status(200).send(role.dataValues)
}

export async function deleteRoleAction(request, response) {
  const roleId = Number(request.params.id)

  const shouldReturnDeletedRecords = true
  const hasUsersWithRole = await dbUsersService.hasUsersWithRole(
    roleId,
    shouldReturnDeletedRecords
  )

  if (hasUsersWithRole === true) {
    return response
      .status(409)
      .send({ reason: 'At least one user is assigned to given role' })
  }

  const deleteResult = await dbRolesService.remove(roleId)

  if (deleteResult !== true) {
    return response.status(404).send({ reason: 'Role not found' })
  }

  response.status(204).send()
}
