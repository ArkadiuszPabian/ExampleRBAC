import { requirePermission } from '../middlewares/require-permission.middleware.js'

import * as controller from '../controllers/user.controller.js'

export function registerRoutes(app) {
  app.get('/users', requirePermission('view:users'), controller.getUsersAction)

  app.post(
    '/users',
    requirePermission('create:users'),
    controller.createUserAction
  )

  app.put(
    '/users/:id',
    requirePermission('update:users'),
    controller.updateUserAction
  )

  app.delete(
    '/users/:id',
    requirePermission('delete:users'),
    controller.deleteUserAction
  )

  return app
}
