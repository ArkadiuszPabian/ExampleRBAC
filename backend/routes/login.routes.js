import express from 'express'
import * as controller from '../controllers/login.controller.js'

const router = express.Router()

router.post('/login', controller.loginAction)

router.post('/logout', controller.logoutAction)

export default router
