import express from 'express'

import articleRoutes from './article.routes.js'
import authRoutes from './auth.routes.js'
import meRoutes from './me.routes.js'
import permissionRoutes from './permission.routes.js'
import roleRoutes from './role.routes.js'
import userRoutes from './user.routes.js'

const router = express.Router()

router.use('/articles', articleRoutes)
router.use('/users', userRoutes)
router.use('/auth', authRoutes)
router.use('/roles', roleRoutes)
router.use('/permissions', permissionRoutes)
router.use('/me', meRoutes)

export default router
