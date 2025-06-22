import 'dotenv/config'

import app from './app.js'
import config from './services/config.service.js'
import initDb from './services/db-init.service.js'

initDb()
  .then(() => {
    app.listen(config.port, () => {
      console.info(`Server listening on port ${config.port}`)
    })
  })
  .catch((err) => {
    console.error('Failed to initialize DB', err)
    process.exit(1)
  })
