import app from './app.js'
import initDb from './services/db-init.service.js'

import config from './services/config.service.js'
import http from 'http'

initDb()
  .then(() => {
    const server = http.createServer(app)

    server.listen(config.port, config.host, () => {
      console.info(`Server is running on http://${config.host}:${config.port}`)
    })
  })
  .catch((err) => {
    console.error('Failed to initialize DB', err)
    process.exit(1)
  })
