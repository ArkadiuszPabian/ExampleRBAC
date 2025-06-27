import express from 'express'
import * as controller from '../controllers/role.controller.js'
import { requirePermission } from '../middlewares/require-permission.middleware.js'

const router = express.Router()

router.get(
  '/:id',
  requirePermission('view:roles'),
  controller.getSingleRoleAction
)

router.get('/', requirePermission('view:roles'), controller.getRolesAction)

router.post('/', requirePermission('create:roles'), controller.createRoleAction)

router.put(
  '/:id',
  requirePermission('update:roles'),
  controller.updateRoleAction
)

router.delete(
  '/:id',
  requirePermission('delete:roles'),
  controller.deleteRoleAction
)

export default router
