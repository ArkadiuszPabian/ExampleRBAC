import { DataTypes } from 'sequelize'
import db from '../services/db.service.js'

const Permission = db.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  permissionName: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
})

export default Permission
