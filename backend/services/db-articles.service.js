import init from '../models/init.model.js'

export async function getAll() {
  return await init.Article.findAll()
}

export async function get(articleId) {
  return await init.Article.findOne({ where: { id: articleId } })
}

export async function create(title, content, authorId, isPublished) {
  return await init.Article.create({
    title,
    content,
    authorId,
    isPublished,
  })
}

export async function update(articleId, title, content, authorId, isPublished) {
  const article = await init.Article.findOne({ where: { id: articleId } })
  if (article === null) {
    return null
  }

  // Update fields if provided
  article.title = title
  article.content = content
  article.authorId = authorId
  article.isPublished = isPublished

  await article.save()
  return article
}

export async function remove(articleId) {
  const article = await init.Article.findOne({ where: { id: articleId } })
  if (article === null) {
    return null
  }

  await article.destroy()

  return true
}
