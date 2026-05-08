import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json } from 'express'
import helmet from 'helmet'
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

if (config.isSSL) {
  // Enforce SSL in production
  app.use(redirectToHTTPS())
}

// Register routes
app.use('/api', apiRoutes)

export default app
