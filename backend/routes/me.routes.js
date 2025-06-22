import express from 'express'
import * as controller from '../controllers/me.controller.js'

const router = express.Router()

router.get('/', controller.getMyInfoAction)

export default router
