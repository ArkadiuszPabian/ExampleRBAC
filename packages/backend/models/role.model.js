import { DataTypes } from 'sequelize'
import db from '../services/db.service.js'

const Role = db.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roleName: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
})

export default Role
