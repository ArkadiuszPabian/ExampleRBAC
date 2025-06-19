import cookieParser from 'cookie-parser'
import express, { json } from 'express'
import apiRoutes from './routes/index.routes.js'

const app = express()

// Apply middleware
app.use(json())
app.use(cookieParser())

// Register routes
app.use('/api', apiRoutes)

export default app
