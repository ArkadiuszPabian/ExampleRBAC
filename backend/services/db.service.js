import { Sequelize } from 'sequelize'
import config from './config.service.js'

// In-memory DB (does not persist)
// Look for: https://github.com/sequelize/sequelize/issues/16923#issuecomment-1951756127
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.environment === 'production' ? 'db.sqlite' : ':memory:',
  logging: false,
})

export default sequelize
