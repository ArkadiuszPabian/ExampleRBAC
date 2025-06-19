import * as dbArticlesService from '../services/db-articles.service.js'
import * as dbUsersService from '../services/db-users.service.js'

export async function getArticlesAction(_request, response) {
  const articles = await dbArticlesService.getAll()

  const uniqueUserIds = articles
    .map((article) => article.authorId)
    .filter((v, i, a) => a.indexOf(v) === i)

  const users = await dbUsersService.getWithIds(uniqueUserIds)

  const preparedArticles = []
  for (const article of articles) {
    const preparedArticle = article

    preparedArticle.author = users.find(
      (user) => user.id === preparedArticle.authorId
    ).username
    delete preparedArticle.authorId

    preparedArticles.push(preparedArticle)
  }

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

  const user = await dbUsersService.get(authorId)

  if (user === null) {
    return response.status(400).send({ reason: 'Provided author not found' })
  }

  const title = request.body.title
  const description = request.body.description
  const isPublished = false

  const article = await dbArticlesService.create(
    title,
    description,
    authorId,
    isPublished
  )

  response.status(200).send(article)
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
  const description = request.body.description
  const authorId = request.body.authorId

  const user = await dbUsersService.get(authorId)

  if (user === null) {
    return response.status(400).send({ reason: 'Provided author not found' })
  }

  const isPublished = false

  const updatedArticle = await dbArticlesService.update(
    articleId,
    title,
    description,
    authorId,
    isPublished
  )

  response.status(200).send(updatedArticle)
}

export async function deleteArticleAction(request, response) {
  const articleId = Number(request.params.id)

  const deleteResult = await dbArticlesService.remove(articleId)

  if (deleteResult !== true) {
    return response.status(404).send({ reason: 'Article not found' })
  }

  response.status(204).send()
}
