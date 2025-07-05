import express from 'express'
import * as controller from '../controllers/auth.controller.js'
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js'

const router = express.Router()

router.post('/login', controller.loginAction)

router.post('/logout', controller.logoutAction)

router.post('/refresh', controller.rotateRefreshTokenAction)

router.head('/status', requireAccessToken(), controller.status)

export default router
