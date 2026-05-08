import * as dbArticlesService from '../services/db-articles.service.js'
import * as dbUsersService from '../services/db-users.service.js'

export async function getSingleArticleAction(request, response) {
  const articleId = Number(request.params.id)

  const article = await dbArticlesService.get(articleId)
  const preparedArticle = article?.dataValues ?? article
  delete preparedArticle.id

  response.status(200).send(preparedArticle)
}

export async function getArticlesAction(_request, response) {
  const articles = await dbArticlesService.getAll()

  const uniqueUserIds = articles
    .map((article) => (article?.dataValues ?? article).authorId)
    .filter((v, i, a) => a.indexOf(v) === i)

  const shouldReturnDeletedRecords = true
  const users = await dbUsersService.getWithIds(
    uniqueUserIds,
    shouldReturnDeletedRecords
  )

  const preparedArticles = articles.map((article) => {
    const preparedArticle = { ...(article?.dataValues ?? article) }
    const author = users.find(
      (user) => (user?.dataValues ?? user).id === preparedArticle.authorId
    )?.dataValues?.username
    preparedArticle.author = author
    delete preparedArticle.authorId
    return preparedArticle
  })

  response.status(200).send(preparedArticles)
}

export async function createArticleAction(request, response) {
  if (request.body.title === undefined) {
    return response.status(400).send({ reason: 'Title not provided' })
  }

  if (request.body.authorId === undefined) {
    return response.status(400).send({ reason: 'Author id not provided' })
  }

  const authorId = request.body.authorId

  const shouldReturnDeletedRecords = false
  const user = await dbUsersService.get(authorId, shouldReturnDeletedRecords)

  if (user === null) {
    return response.status(400).send({ reason: 'Provided author not found' })
  }

  const title = request.body.title
  const content = request.body.content
  const isPublished = request.body.isPublished === true

  const article = await dbArticlesService.create(
    title,
    content,
    authorId,
    isPublished
  )

  response.status(201).send(article?.dataValues ?? article)
}

export async function updateArticleAction(request, response) {
  if (request.body.title === undefined) {
    return response.status(400).send({ reason: 'Title not provided' })
  }

  if (request.body.authorId === undefined) {
    return response.status(400).send({ reason: 'Author id not provided' })
  }

  const articleId = Number(request.params.id)

  const article = await dbArticlesService.get(articleId)

  if (article === null) {
    return response.status(404).send({ reason: 'Article not found' })
  }

  const title = request.body.title
  const content = request.body.content
  const authorId = request.body.authorId

  const shouldReturnDeletedRecords = true
  const user = await dbUsersService.get(authorId, shouldReturnDeletedRecords)

  if (user === null) {
    return response.status(400).send({ reason: 'Provided author not found' })
  }

  const isPublished = request.body.isPublished === true
  const updatedArticle = await dbArticlesService.update(
    articleId,
    title,
    content,
    authorId,
    isPublished
  )

  response.status(200).send(updatedArticle?.dataValues ?? updatedArticle)
}

export async function deleteArticleAction(request, response) {
  const articleId = Number(request.params.id)

  const deleteResult = await dbArticlesService.remove(articleId)

  if (deleteResult !== true) {
    return response.status(404).send({ reason: 'Article not found' })
  }

  response.status(204).send()
}
