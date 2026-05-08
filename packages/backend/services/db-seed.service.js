import fs from 'fs'
import config from './config.service.js'
import init from '../models/init.model.js'
import { hashPassword } from './hash.service.js'
import { PermissionMap } from './permission.service.js'

export default async function seedDatabase() {
  const hasRecordsInDb = (await init.Permission.count()) > 0

  // Stop seed process if data are already there
  // Permission db is constant, data cannot be deleted from there
  // so if any data is put here, we can safely seed db
  if (hasRecordsInDb) {
    return
  }

  // Seeding is opt-in: a JSON file at SEED_DATA_PATH (typically a mounted
  // ConfigMap from the Helm chart). Without it, the DB stays empty so the
  // app boots clean in dev/test and the cluster operator owns initial data.
  if (!config.seedDataPath || !fs.existsSync(config.seedDataPath)) {
    return
  }

  const seed = JSON.parse(fs.readFileSync(config.seedDataPath, 'utf-8'))

  const permissions = seed.permissions ?? Object.values(PermissionMap)
  const permissionByName = {}
  for (const name of permissions) {
    const row = await init.Permission.create({ permissionName: name })
    permissionByName[name] = row
  }

  const roleByName = {}
  for (const role of seed.roles ?? []) {
    const row = await init.Role.create({ roleName: role.name })
    roleByName[role.name] = row
    const pairs = (role.permissions ?? []).map((p) => ({
      roleId: row.id,
      permissionId: permissionByName[p].id,
    }))
    if (pairs.length > 0) {
      await init.RolePermission.bulkCreate(pairs)
    }
  }

  const userByName = {}
  for (const user of seed.users ?? []) {
    const row = await init.User.create({
      username: user.username,
      hashedPassword: await hashPassword(user.password),
      roleId: roleByName[user.role].id,
      isActivated: user.isActivated ?? true,
    })
    userByName[user.username] = row
  }

  for (const article of seed.articles ?? []) {
    await init.Article.create({
      title: article.title,
      content: article.content,
      isPublished: article.isPublished ?? false,
      authorId: userByName[article.authorUsername].id,
    })
  }
}
