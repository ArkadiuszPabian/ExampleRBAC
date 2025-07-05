import express from 'express'
import * as controller from '../controllers/me.controller.js'
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js'

const router = express.Router()

router.get('/', requireAccessToken(), controller.getMyInfoAction)

export default router
