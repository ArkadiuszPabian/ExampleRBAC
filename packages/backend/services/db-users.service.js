import init from '../models/init.model.js'

export async function getWithIds(userIdArray, shouldReturnDeletedRecords) {
  return await init.User.findAll({
    where: { id: userIdArray },
    paranoid: !shouldReturnDeletedRecords,
    attributes: { exclude: ['hashedPassword'] },
    include: [{ model: init.Role, attributes: ['roleName'] }],
  })
}

export async function getAll(shouldReturnDeletedRecords) {
  return await init.User.findAll({
    paranoid: !shouldReturnDeletedRecords,
    attributes: { exclude: ['hashedPassword'] },
    include: [{ model: init.Role, attributes: ['roleName'] }],
  })
}

export async function get(userId, shouldReturnDeletedRecords) {
  return await init.User.findOne({
    where: { id: userId },
    paranoid: !shouldReturnDeletedRecords,
    attributes: { exclude: ['hashedPassword'] },
    include: [{ model: init.Role, attributes: ['roleName'] }],
  })
}

export async function hasUsersWithRole(roleId, shouldReturnDeletedRecords) {
  return (
    (await init.User.count({
      where: { roleId },
      paranoid: !shouldReturnDeletedRecords,
    })) > 0
  )
}

export async function create(username, hashedPassword, roleId, isActivated) {
  return await init.User.create({
    username,
    hashedPassword,
    roleId,
    isActivated,
  })
}

export async function update(
  userId,
  hashedPassword,
  roleId,
  isActivated,
  shouldReturnDeletedRecords
) {
  const user = await init.User.findOne({
    where: { id: userId },
    paranoid: !shouldReturnDeletedRecords,
  })
  if (user === null) {
    return null
  }

  // Update fields if provided
  if (hashedPassword !== undefined) {
    user.hashedPassword = hashedPassword
  }
  user.roleId = roleId
  user.isActivated = isActivated

  await user.save()
  return user
}

export async function remove(userId) {
  // with soft-deletion, should not find deleted item, which is fine for the use case
  const user = await init.User.findOne({
    where: { id: userId },
  })

  if (user === null) {
    return null
  }

  await user.destroy() // should soft-delete record thanks to 'paranoid: true' flag in user model

  return true
}

export async function getUserByUsername(username, shouldReturnDeletedRecords) {
  return await init.User.findOne({
    where: { username },
    paranoid: !shouldReturnDeletedRecords,
  })
}

export async function exists(username, shouldReturnDeletedRecords) {
  return (
    (await init.User.count({
      where: { username },
      paranoid: !shouldReturnDeletedRecords,
    })) > 0
  )
}
