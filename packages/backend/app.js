import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json } from 'express'
import helmet from 'helmet'
import apiRoutes from './routes/index.routes.js'
import config from './services/config.service.js'

const app = express()

// Trust the first hop in front of the app. In production this is the Kubernetes
// Gateway API ingress that terminates TLS and forwards traffic over plain HTTP
// to this Service. With trust proxy enabled, Express reads X-Forwarded-* headers
// set by the gateway, so req.protocol, req.ip, and the Secure cookie flag
// reflect the original client connection rather than the in-cluster hop.
app.set('trust proxy', 1)

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

// Register routes
app.use('/api', apiRoutes)

export default app
