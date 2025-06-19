import express from 'express'
import * as controller from '../controllers/login.controller.js'

const router = express.Router()

router.post('/', controller.loginAction)

export default router
