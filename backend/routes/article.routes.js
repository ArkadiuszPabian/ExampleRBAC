import { requirePermission } from '../middlewares/require-permission.middleware.js'

import * as controller from '../controllers/article.controller.js'

export function registerRoutes(app) {
  app.get(
    '/articles',
    requirePermission('view:articles'),
    controller.getArticlesAction
  )

  app.post(
    '/articles',
    requirePermission('create:articles'),
    controller.createArticleAction
  )

  app.put(
    '/articles/:id',
    requirePermission('update:articles'),
    controller.updateArticleAction
  )

  app.delete(
    '/articles/:id',
    requirePermission('delete:articles'),
    controller.deleteArticleAction
  )

  return app
}
