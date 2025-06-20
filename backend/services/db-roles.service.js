import init from '../models/init.model.js'
import db from '../services/db.service.js'

export async function getAll() {
  return await init.Article.findAll()
}

export async function exists(roleId) {
  return (await init.Role.count({ where: { id: roleId } })) > 0
}

export async function create(roleName, permissions) {
  const transaction = await db.transaction()

  try {
    const role = await init.Role.create(
      {
        roleName,
      },
      { transaction }
    )
    const roleId = role.id

    const dbPermissions = await init.Permission.findAll(
      { where: { permissionName: permissions } },
      { transaction }
    )

    const permissionIds = dbPermissions.map((dbPerm) => dbPerm.dataValues.id)

    await init.RolePermission.bulkCreate(
      permissionIds.map((permissionId) => ({ permissionId, roleId })),
      { transaction }
    )
    await transaction.commit()
    return role
  } catch (error) {
    console.error({ error })
    await transaction.rollback()
    return null
  }
}

export async function update(roleId, roleName, permissions) {
  const transaction = await db.transaction()

  try {
    const role = await init.Role.findOne(
      {
        id: roleId,
      },
      { transaction }
    )

    if (role === null) {
      await transaction.rollback()
      return false
    }

    role.roleName = roleName

    await role.save({ transaction })

    await init.RolePermission.destroy({ where: { roleId } }, { transaction })

    const dbPermissions = await init.Permission.findAll(
      { where: { permissionName: permissions } },
      { transaction }
    )

    const permissionIds = dbPermissions.map((dbPerm) => dbPerm.dataValues.id)

    await init.RolePermission.bulkCreate(
      permissionIds.map((permissionId) => ({ permissionId, roleId })),
      { transaction }
    )
    await transaction.commit()
    return role
  } catch (error) {
    console.error({ error })
    await transaction.rollback()
    return null
  }
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

export async function remove(roleId) {
  const role = await init.Role.findOne({ where: { id: roleId } })
  if (role === null) {
    return null
  }

  await role.destroy()

  return true
}
