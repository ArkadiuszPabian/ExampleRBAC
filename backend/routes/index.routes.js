import express from 'express'

import articleRoutes from './article.routes.js'
import loginRoutes from './login.routes.js'
import permissionRoutes from './permission.routes.js'
import roleRoutes from './role.routes.js'
import userRoutes from './user.routes.js'

const router = express.Router()

router.use('/articles', articleRoutes)
router.use('/users', userRoutes)
router.use('/login', loginRoutes)
router.use('/roles', roleRoutes)
router.use('/permissions', permissionRoutes)

export default router
