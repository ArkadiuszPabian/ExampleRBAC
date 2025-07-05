import { DataTypes } from 'sequelize'
import db from '../services/db.service.js'

const RefreshToken = db.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sessionStartedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  replacedByTokenId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  parentTokenId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
})

export default RefreshToken
