import seedDatabase from './db-seed.service.js'
import db from './db.service.js'

export default async function initDb() {
  try {
    await db.sync({ force: true })

    await seedDatabase()
  } catch (error) {
    console.error('Failed to sync database:', error)
    process.exit(1)
  }
}
