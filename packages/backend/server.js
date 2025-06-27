import app from './app.js'
import initDb from './services/db-init.service.js'

import config from './services/config.service.js'

initDb()
  .then(() => {
    app.listen(config.port, config.host, () => {
      const protocol = config.isSSL ? 'https' : 'http'
      console.info(
        `Server is running on ${protocol}://${config.host}:${config.port}`
      )
    })
  })
  .catch((err) => {
    console.error('Failed to initialize DB', err)
    process.exit(1)
  })
