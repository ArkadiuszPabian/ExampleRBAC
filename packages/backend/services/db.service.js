import { Sequelize } from 'sequelize'
import config from './config.service.js'

// DB_STORAGE env var controls persistence: a filesystem path (e.g. mounted PVC)
// or ':memory:'. When unset, default to in-memory so dev/test workflows are
// hermetic and the cluster operator opts into persistence explicitly.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.dbStorage,
  logging: false,
})

export default sequelize
