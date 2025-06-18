import init from '../models/init.model.js'

export async function exists(roleId) {
  return (await init.Role.count({ where: { id: roleId } })) > 0
}

export async function hasPermission(roleId, permissionName) {
  const permissions = await init.RolePermission.findAll({ where: { roleId } })

  const permissionIds = permissions
    .map((perm) => perm.permissionId)
    .filter((v, i, a) => a.indexOf(v) === i)

  const dbPermissions = await init.Permission.findAll({
    where: { id: permissionIds },
  })

  const permissionExists = dbPermissions.some(
    (perm) => perm.permissionName === permissionName
  )

  return permissionExists
}
