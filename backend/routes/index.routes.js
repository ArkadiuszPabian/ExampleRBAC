import express from 'express'

import articleRoutes from './article.routes.js'
import loginRoutes from './login.routes.js'
import userRoutes from './user.routes.js'

const router = express.Router()

router.use('/articles', articleRoutes)
router.use('/users', userRoutes)
router.use('/login', loginRoutes)

export default router
