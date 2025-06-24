import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json } from 'express'
import helmet from 'helmet'
import apiRoutes from './routes/index.routes.js'

const app = express()

// Apply middleware
app.use(json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'https://localhost:4201',
    credentials: true,
  })
)
app.use(helmet())

// Register routes
app.use('/api', apiRoutes)

export default app
