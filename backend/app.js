import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json } from 'express'
import fs from 'fs'
import helmet from 'helmet'
import http from 'http'
import https from 'https'
import path from 'path'
import { redirectToHTTPS } from './middlewares/redirect-to-https.middleware.js'
import apiRoutes from './routes/index.routes.js'
import config from './services/config.service.js'

const app = express()

// Apply middleware
app.use(json())
app.use(cookieParser())
app.use(
  cors({
    origin: config.frontendAddress,
    credentials: true,
  })
)
app.use(helmet())

if (config.environment === 'production') {
  // Enforce SSL in production
  app.use(redirectToHTTPS())
}

// Register routes
app.use('/api', apiRoutes)

console.log({ config })

let server
if (config.environment === 'production') {
  const sslOptions = {
    key: fs.readFileSync(path.resolve(config.sslKeyPath)),
    cert: fs.readFileSync(path.resolve(config.sslCertPath)),
  }

  server = https.createServer(sslOptions, app)
} else {
  server = http.createServer(app)
}

export default server
