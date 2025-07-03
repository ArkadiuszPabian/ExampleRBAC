import express from 'express'
import * as controller from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/login', controller.loginAction)

router.post('/logout', controller.logoutAction)

router.post('/refresh', controller.rotateRefreshTokenAction)

export default router
