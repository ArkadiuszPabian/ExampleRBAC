import init from '../models/init.model.js'

export async function getWithIds(userIdArray) {
  return await init.User.findAll({ where: { id: userIdArray } })
}

export async function getAll() {
  return await init.User.findAll()
}

export async function get(userId) {
  return await init.User.findOne({ where: { id: userId } })
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
  username,
  hashedPassword,
  roleId,
  isActivated
) {
  const user = await init.User.findOne({ where: { id: userId } })
  if (user === null) {
    return null
  }

  // Update fields if provided
  user.username = username
  user.hashedPassword = hashedPassword
  user.roleId = roleId
  user.isActivated = isActivated

  await article.save()
  return article
}

export async function remove(userId) {
  const user = await init.User.findOne({ where: { id: userId } })

  if (user === null) {
    return null
  }

  await user.destroy()

  return true
}

export async function getUserByUsername(username) {
  return await init.User.findOne({ where: { username } })
}

export async function exists(username) {
  return (await init.User.count({ where: { username } })) > 0
}
