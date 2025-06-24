import app from './app.js'
import initDb from './services/db-init.service.js'

console.log(process.env.NODE_ENV)

import config from './services/config.service.js'

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
