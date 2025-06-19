import init from '../models/init.model.js'
import { hashPassword } from './hash.service.js'

export default async function seedDatabase() {
  // Seed roles
  const adminRole = await init.Role.create({ roleName: 'admin' })
  const moderatorRole = await init.Role.create({ roleName: 'moderator' })
  const userRole = await init.Role.create({ roleName: 'user' })

  // Seed permissions
  const viewArticles = await init.Permission.create({
    permissionName: 'view:articles',
  })
  const createArticles = await init.Permission.create({
    permissionName: 'create:articles',
  })
  const updateArticles = await init.Permission.create({
    permissionName: 'update:articles',
  })
  const deleteArticles = await init.Permission.create({
    permissionName: 'delete:articles',
  })
  const viewUsers = await init.Permission.create({
    permissionName: 'view:users',
  })
  const createUsers = await init.Permission.create({
    permissionName: 'create:users',
  })
  const updateUsers = await init.Permission.create({
    permissionName: 'update:users',
  })
  const deleteUsers = await init.Permission.create({
    permissionName: 'delete:users',
  })

  // Seed role-permissions
  await init.RolePermission.bulkCreate([
    // Admin
    {
      roleId: adminRole.id,
      permissionId: viewArticles.id,
    },
    {
      roleId: adminRole.id,
      permissionId: createArticles.id,
    },
    {
      roleId: adminRole.id,
      permissionId: updateArticles.id,
    },
    {
      roleId: adminRole.id,
      permissionId: deleteArticles.id,
    },
    {
      roleId: adminRole.id,
      permissionId: viewUsers.id,
    },
    {
      roleId: adminRole.id,
      permissionId: createUsers.id,
    },
    {
      roleId: adminRole.id,
      permissionId: updateUsers.id,
    },
    {
      roleId: adminRole.id,
      permissionId: deleteUsers.id,
    },

    // Moderator
    {
      roleId: moderatorRole.id,
      permissionId: viewArticles.id,
    },
    {
      roleId: moderatorRole.id,
      permissionId: createArticles.id,
    },
    {
      roleId: moderatorRole.id,
      permissionId: updateArticles.id,
    },
    {
      roleId: moderatorRole.id,
      permissionId: deleteArticles.id,
    },

    // User
    {
      roleId: userRole.id,
      permissionId: viewArticles.id,
    },
  ])

  await init.User.create({
    username: 'admin',
    hashedPassword: await hashPassword('test'),
    roleId: adminRole.id,
    isActivated: true,
  })

  await init.User.create({
    username: 'moderator',
    hashedPassword: await hashPassword('test'),
    roleId: moderatorRole.id,
    isActivated: true,
  })

  const user = await init.User.create({
    username: 'user',
    hashedPassword: await hashPassword('test'),
    roleId: userRole.id,
    isActivated: false,
  })

  await init.Article.create({
    title: 'John Papa',
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    isPublished: true,
    authorId: user.id,
  })
}
