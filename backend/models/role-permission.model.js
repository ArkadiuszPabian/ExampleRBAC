import { DataTypes } from 'sequelize'
import db from '../services/db.service.js'

const RolePermission = db.define('RolePermission', {
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id',
    },
    primaryKey: true,
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Permissions',
      key: 'id',
    },
    primaryKey: true,
  },
})

export default RolePermission
