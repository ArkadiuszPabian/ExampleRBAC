import { describe, expect, it } from '@jest/globals'
import request from 'supertest'

import * as dbArticlesService from '../services/db-articles.service.js'
import * as dbUsersService from '../services/db-users.service.js'

import app from '../app.js'

jest.mock('../services/db-articles.service.js')
jest.mock('../services/db-users.service.js')
jest.mock('../services/config.service.js', () => ({
  default: {
    refreshTokenCookieName: 'refresh_token',
    refreshTokenLifetimeInMs: 1000,
    loginSessionLifetimeInMs: 1000,
    accessTokenLifetime: '15m',
    refreshTokenLifetime: '7d',
    frontendAddress: 'http://localhost:4200',
    refreshTokenSecret: 'test',
    accessTokenSecret: 'test',
    environment: 'test',
  },
}))
jest.mock('../middlewares/require-permission.middleware.js', () => ({
  requirePermission: function (_permission) {
    return async (_request, _response, next) => next()
  },
}))

beforeEach(() => {
  dbArticlesService.getAll.mockClear()
  dbArticlesService.get.mockClear()
  dbArticlesService.create.mockClear()
  dbArticlesService.update.mockClear()
  dbArticlesService.remove.mockClear()
  dbUsersService.getWithIds.mockClear()
  dbUsersService.get.mockClear()
})

const url = '/api/articles'

describe('GET /articles', () => {
  it('should replace author id with username in each article', async () => {
    const article1 = {
      title: 'a',
      content: 'b',
      authorId: 1,
      isPublished: true,
    }

    const article2 = {
      title: 'c',
      content: 'd',
      authorId: 2,
      isPublished: false,
    }

    const username1 = 'author1'
    const username2 = 'author2'

    dbArticlesService.getAll.mockResolvedValue([article1, article2])
    dbUsersService.getWithIds.mockResolvedValue([
      {
        dataValues: { id: 1, username: username1 },
      },
      {
        dataValues: { id: 2, username: username2 },
      },
    ])

    const res = await request(app).get(url).send()

    const { authorId: _1, ...a1 } = article1
    const { authorId: _2, ...a2 } = article2
    const modifiedArticles = [
      { ...a1, author: username1 },
      { ...a2, author: username2 },
    ]

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(modifiedArticles)
  })

  it('should query only for unique user ids based on given article authors', async () => {
    const sameId = 1
    const article1 = {
      title: 'a',
      content: 'b',
      authorId: sameId,
      isPublished: true,
    }

    const article2 = {
      title: 'c',
      content: 'd',
      authorId: sameId,
      isPublished: false,
    }

    const username = 'author'

    dbArticlesService.getAll.mockResolvedValue([article1, article2])
    dbUsersService.getWithIds.mockResolvedValue([
      {
        dataValues: { id: 1, username },
      },
    ])

    const res = await request(app).get(url).send()

    expect(res.statusCode).toBe(200)
    expect(dbUsersService.getWithIds).toHaveBeenCalledWith(
      [sameId],
      true
    )
  })

  it('should return all existing articles', async () => {
    const article = {
      title: 'a',
      content: 'b',
      authorId: 1,
      isPublished: true,
    }

    const username = 'author'

    dbArticlesService.getAll.mockResolvedValue([article])
    dbUsersService.getWithIds.mockResolvedValue([
      {
        dataValues: { id: 1, username },
      },
    ])

    const res = await request(app).get(url).send()

    const { authorId: _, ...modifiedArticle } = { ...article, author: username }

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([modifiedArticle])
  })
})

describe('POST /articles', () => {
  it('should return Bad Request if title was not provided in new article', async () => {
    const res = await request(app).post(url).send({})

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Title not provided')
  })

  it('should return Bad Request if authorId was not provided in new article', async () => {
    const res = await request(app).post(url).send({
      title: 'a',
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Author id not provided')
  })

  it('should return Bad Request if there is no user with authorId in database', async () => {
    dbUsersService.get.mockResolvedValue(null)

    const res = await request(app).post(url).send({
      title: 'a',
      authorId: 1,
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toBe('Provided author not found')
  })

  it('should create new article', async () => {
    const article = {
      title: 'a',
      content: 'b',
      authorId: 1,
    }
    dbUsersService.get.mockResolvedValue({})
    dbArticlesService.create.mockResolvedValue(article)

    const res = await request(app).post(url).send(article)

    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual(article)
  })
})

describe('PUT /articles/:id', () => {
  const urlWithId = url + '/1'

  it('should return Not Found if id was not provided for update of article', async () => {
    const res = await request(app).put(url).send({})

    expect(res.statusCode).toBe(404)
  })

  it('should return Bad Request if title was not provided for update of article', async () => {
    const res = await request(app).put(urlWithId).send({})

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toEqual('Title not provided')
  })

  it('should return Bad Request if authorId was not provided for update of article', async () => {
    const res = await request(app).put(urlWithId).send({
      title: 'a',
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toEqual('Author id not provided')
  })

  it('should return Bad Request if article with given id does not exist', async () => {
    dbArticlesService.get.mockResolvedValue(null)

    const res = await request(app).put(urlWithId).send({
      title: 'a',
      authorId: 1,
    })

    expect(res.statusCode).toBe(404)
    expect(res.body.reason).toEqual('Article not found')
  })

  it('should return Bad Request if there is no user with authorId in database', async () => {
    dbArticlesService.get.mockResolvedValue({})
    dbUsersService.get.mockResolvedValue(null)

    const res = await request(app).put(urlWithId).send({
      title: 'a',
      authorId: 1,
    })

    expect(res.statusCode).toBe(400)
    expect(res.body.reason).toEqual('Provided author not found')
  })

  it('should update existing article', async () => {
    dbArticlesService.get.mockResolvedValue({})
    dbUsersService.get.mockResolvedValue({})

    const res = await request(app).put(urlWithId).send({
      title: 'a',
      authorId: 1,
    })

    expect(res.statusCode).toBe(200)
  })
})

describe('DELETE /articles/:id', () => {
  const urlWithId = url + '/1'

  it('should return Not Found if id was not provided for deletion of article', async () => {
    const res = await request(app).delete(url).send({})

    expect(res.statusCode).toBe(404)
  })

  it('should return Not Found if article with given id does not exist', async () => {
    dbArticlesService.remove.mockResolvedValue(null)
    const res = await request(app).delete(urlWithId).send({})

    expect(res.statusCode).toBe(404)
    expect(res.body.reason).toBe('Article not found')
  })

  it('should delete existing article', async () => {
    dbArticlesService.remove.mockResolvedValue(true)
    const res = await request(app).delete(urlWithId).send({})

    expect(dbArticlesService.remove).toHaveBeenCalledWith(1)
    expect(res.statusCode).toBe(204)
  })
})
