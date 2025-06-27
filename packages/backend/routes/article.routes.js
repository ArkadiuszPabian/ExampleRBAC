import express from 'express'
import * as controller from '../controllers/article.controller.js'
import { requirePermission } from '../middlewares/require-permission.middleware.js'

const router = express.Router()

router.get(
  '/:id',
  requirePermission('view:articles'),
  controller.getSingleArticleAction
)

router.get('/', controller.getArticlesAction)

router.post(
  '/',
  requirePermission('create:articles'),
  controller.createArticleAction
)

router.put(
  '/:id',
  requirePermission('update:articles'),
  controller.updateArticleAction
)

router.delete(
  '/:id',
  requirePermission('delete:articles'),
  controller.deleteArticleAction
)

export default router
