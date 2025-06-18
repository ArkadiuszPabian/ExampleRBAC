import cookieParser from 'cookie-parser'
import express, { json } from 'express'
import * as articleRoutes from './routes/article.routes.js'
import * as loginRoutes from './routes/login.routes.js'
import * as userRoutes from './routes/user.routes.js'

const app = express()

// Apply middleware
app.use(json())
app.use(cookieParser())

// Register routes
loginRoutes.registerRoutes(app)
articleRoutes.registerRoutes(app)
userRoutes.registerRoutes(app)

export default app
