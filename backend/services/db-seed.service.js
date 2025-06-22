import init from '../models/init.model.js'
import { hashPassword } from './hash.service.js'
import { PermissionMap } from './permission.service.js'

export default async function seedDatabase() {
  // Seed roles
  const adminRole = await init.Role.create({ roleName: 'admin' })
  const moderatorRole = await init.Role.create({ roleName: 'moderator' })
  const userRole = await init.Role.create({ roleName: 'user' })

  // Seed permissions
  const viewArticles = await init.Permission.create({
    permissionName: PermissionMap.VIEW_ARTICLES,
  })
  const createArticles = await init.Permission.create({
    permissionName: PermissionMap.CREATE_ARTICLES,
  })
  const updateArticles = await init.Permission.create({
    permissionName: PermissionMap.UPDATE_ARTICLES,
  })
  const deleteArticles = await init.Permission.create({
    permissionName: PermissionMap.DELETE_ARTICLES,
  })
  const viewUsers = await init.Permission.create({
    permissionName: PermissionMap.VIEW_USERS,
  })
  const createUsers = await init.Permission.create({
    permissionName: PermissionMap.CREATE_USERS,
  })
  const updateUsers = await init.Permission.create({
    permissionName: PermissionMap.UPDATE_USERS,
  })
  const deleteUsers = await init.Permission.create({
    permissionName: PermissionMap.DELETE_USERS,
  })
  const viewRoles = await init.Permission.create({
    permissionName: PermissionMap.VIEW_ROLES,
  })
  const createRoles = await init.Permission.create({
    permissionName: PermissionMap.CREATE_ROLES,
  })
  const updateRoles = await init.Permission.create({
    permissionName: PermissionMap.UPDATE_ROLES,
  })
  const deleteRoles = await init.Permission.create({
    permissionName: PermissionMap.DELETE_ROLES,
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
    {
      roleId: adminRole.id,
      permissionId: viewRoles.id,
    },
    {
      roleId: adminRole.id,
      permissionId: createRoles.id,
    },
    {
      roleId: adminRole.id,
      permissionId: updateRoles.id,
    },
    {
      roleId: adminRole.id,
      permissionId: deleteRoles.id,
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
    title: 'Test',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin varius ultricies ultrices. Vivamus sodales metus ac sapien lobortis congue. In hac habitasse platea dictumst. Sed non laoreet massa, sit amet tincidunt turpis. Integer vulputate laoreet felis, ac porttitor mauris. Ut eget mollis tellus, in laoreet neque. Donec libero sem, iaculis vel nisi id, tempor elementum ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet dolor ante. Vestibulum vehicula cursus elit, eget ultrices nulla ultricies ac.`,
    isPublished: true,
    authorId: user.id,
  })

  await init.Article.create({
    title: 'Test 2',
    content: `Pellentesque et sollicitudin mi, a feugiat est. Phasellus auctor arcu non sem elementum eleifend. Aenean nec interdum felis. Proin rutrum efficitur leo, et suscipit ipsum ullamcorper at. Donec quis suscipit dui. Suspendisse lobortis libero commodo nibh pretium ornare. Curabitur mattis, lacus aliquet bibendum dictum, justo orci luctus turpis, sit amet scelerisque nulla est eget nulla. Donec luctus massa ac nisi viverra fringilla. Aliquam a nisl egestas, fermentum nibh in, molestie elit. Nunc vitae nisl non felis consequat ornare sit amet a lorem. Integer condimentum vulputate placerat.`,
    isPublished: true,
    authorId: user.id,
  })

  await init.Article.create({
    title: 'Test 3',
    content: `Fusce blandit viverra elit feugiat commodo. Morbi et neque in lectus semper elementum in eget lorem. Vestibulum cursus ullamcorper eros id laoreet. Sed ac sodales ante, vitae fringilla felis. Fusce vel arcu eu turpis cursus dapibus et non massa. Sed vitae vehicula eros, ac auctor ex. Integer nec quam eget ipsum sodales faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus mauris orci, porta in feugiat ac, imperdiet ac massa.`,
    isPublished: false,
    authorId: user.id,
  })

  await init.Article.create({
    title: 'Test 4',
    content: `Aenean ac rutrum diam, id lobortis mi. Vivamus blandit in est dignissim posuere. Aliquam vel mi viverra, fringilla leo a, porta lorem. Duis fermentum lectus vitae ullamcorper hendrerit. Suspendisse convallis nulla vitae arcu lobortis, dictum ultrices quam vulputate. Ut pellentesque fermentum mi. Vestibulum eu tempus leo, vel tempor sapien.`,
    isPublished: false,
    authorId: user.id,
  })
}
