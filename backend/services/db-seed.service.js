import init from '../models/init.model.js'
import { hashPassword } from './hash.service.js'

export default async function seedDatabase() {
  // Seed roles
  const adminRole = await init.Role.create({ roleName: 'admin' })
  const moderatorRole = await init.Role.create({ roleName: 'moderator' })
  const userRole = await init.Role.create({ roleName: 'user' })

  // Seed permissions
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
    title: 'Test',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin varius ultricies ultrices. Vivamus sodales metus ac sapien lobortis congue. In hac habitasse platea dictumst. Sed non laoreet massa, sit amet tincidunt turpis. Integer vulputate laoreet felis, ac porttitor mauris. Ut eget mollis tellus, in laoreet neque. Donec libero sem, iaculis vel nisi id, tempor elementum ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet dolor ante. Vestibulum vehicula cursus elit, eget ultrices nulla ultricies ac.`,
    isPublished: true,
    authorId: user.id,
  })

  await init.Article.create({
    title: 'Test 2',
    description: `Pellentesque et sollicitudin mi, a feugiat est. Phasellus auctor arcu non sem elementum eleifend. Aenean nec interdum felis. Proin rutrum efficitur leo, et suscipit ipsum ullamcorper at. Donec quis suscipit dui. Suspendisse lobortis libero commodo nibh pretium ornare. Curabitur mattis, lacus aliquet bibendum dictum, justo orci luctus turpis, sit amet scelerisque nulla est eget nulla. Donec luctus massa ac nisi viverra fringilla. Aliquam a nisl egestas, fermentum nibh in, molestie elit. Nunc vitae nisl non felis consequat ornare sit amet a lorem. Integer condimentum vulputate placerat.`,
    isPublished: true,
    authorId: user.id,
  })

  await init.Article.create({
    title: 'Test 3',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin varius ultricies ultrices. Vivamus sodales metus ac sapien lobortis congue. In hac habitasse platea dictumst. Sed non laoreet massa, sit amet tincidunt turpis. Integer vulputate laoreet felis, ac porttitor mauris. Ut eget mollis tellus, in laoreet neque. Donec libero sem, iaculis vel nisi id, tempor elementum ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet dolor ante. Vestibulum vehicula cursus elit, eget ultrices nulla ultricies ac.`,
    isPublished: false,
    authorId: user.id,
  })

  await init.Article.create({
    title: 'Test 4',
    description: `Pellentesque et sollicitudin mi, a feugiat est. Phasellus auctor arcu non sem elementum eleifend. Aenean nec interdum felis. Proin rutrum efficitur leo, et suscipit ipsum ullamcorper at. Donec quis suscipit dui. Suspendisse lobortis libero commodo nibh pretium ornare. Curabitur mattis, lacus aliquet bibendum dictum, justo orci luctus turpis, sit amet scelerisque nulla est eget nulla. Donec luctus massa ac nisi viverra fringilla. Aliquam a nisl egestas, fermentum nibh in, molestie elit. Nunc vitae nisl non felis consequat ornare sit amet a lorem. Integer condimentum vulputate placerat.`,
    isPublished: false,
    authorId: user.id,
  })
}
