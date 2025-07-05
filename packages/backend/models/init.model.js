import Article from './article.model.js'
import Permission from './permission.model.js'
import RefreshToken from './refresh-token.model.js'
import RolePermission from './role-permission.model.js'
import Role from './role.model.js'
import User from './user.model.js'

// One-to-many: User → Article
User.hasMany(Article, { foreignKey: 'authorId' })
Article.belongsTo(User, { foreignKey: 'authorId' })

// One-to-many: Role → User
Role.hasMany(User, { foreignKey: 'roleId' })
User.belongsTo(Role, { foreignKey: 'roleId' })

// One-to-many: User → RefreshToken
User.hasMany(RefreshToken, { foreignKey: 'userId' })
RefreshToken.belongsTo(User, { foreignKey: 'userId' })

// Many-to-many: Role ↔ Permission
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  onDelete: 'CASCADE',
  hooks: true,
})
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  onDelete: 'CASCADE',
  hooks: true,
})

export default {
  User,
  Article,
  Role,
  Permission,
  RolePermission,
  RefreshToken,
}
