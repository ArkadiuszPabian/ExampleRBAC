import app from './app.js'
import initDb from './services/db-init.service.js'

import config from './services/config.service.js'
import fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'

initDb()
  .then(() => {
    let server
    if (config.isSSL) {
      const sslOptions = {
        key: fs.readFileSync(path.resolve(config.sslKeyPath)),
        cert: fs.readFileSync(path.resolve(config.sslCertPath)),
      }
      server = https.createServer(sslOptions, app)
    } else {
      server = http.createServer(app)
    }

    server.listen(config.port, config.host, () => {
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
