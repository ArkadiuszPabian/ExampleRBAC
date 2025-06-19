import init from '../models/init.model.js'

export async function exists(roleId) {
  return (await init.Role.count({ where: { id: roleId } })) > 0
}

export async function hasPermission(roleId, permissionName) {
  const permission = await init.Permission.findOne({
    where: { permissionName },
  })

  if (permission === null) {
    return false
  }

  const roleCount = await init.RolePermission.count({
    where: { roleId, permissionId: permission.id },
  })

  return roleCount === 1
}

export async function getPermissionNames(roleId) {
  const rolePermissions = await init.RolePermission.findAll({
    where: { roleId },
  })

  const permissionIds = rolePermissions.map((rolePerm) => rolePerm.permissionId)

  const permissions = await init.Permission.findAll({
    where: { id: permissionIds },
  })

  return permissions.map((perm) => perm.permissionName)
}
