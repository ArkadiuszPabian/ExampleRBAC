import { Sequelize } from 'sequelize'

// In-memory DB (does not persist)
// Look for: https://github.com/sequelize/sequelize/issues/16923#issuecomment-1951756127
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
})

export default sequelize
