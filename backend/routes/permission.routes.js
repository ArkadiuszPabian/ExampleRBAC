import express from 'express'
import * as controller from '../controllers/permission.controller.js'
import { requirePermission } from '../middlewares/require-permission.middleware.js'

const router = express.Router()

router.get(
  '/:roleId',
  requirePermission('view:roles'),
  controller.getPermissionsAction
)

export default router
