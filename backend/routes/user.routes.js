import express from 'express'
import * as controller from '../controllers/user.controller.js'
import { requirePermission } from '../middlewares/require-permission.middleware.js'

const router = express.Router()

router.get('/', requirePermission('view:users'), controller.getUsersAction)

router.post('/', requirePermission('create:users'), controller.createUserAction)

router.put(
  '/:id',
  requirePermission('update:users'),
  controller.updateUserAction
)

router.delete(
  '/:id',
  requirePermission('delete:users'),
  controller.deleteUserAction
)

export default router
