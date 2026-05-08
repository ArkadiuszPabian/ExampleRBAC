import init from '../models/init.model.js'
import crypto from 'crypto'
import config from './config.service.js'

function hashRefreshToken(rawToken) {
  if (!config.refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not configured')
  }
  return crypto
    .createHmac('sha256', config.refreshTokenSecret)
    .update(rawToken)
    .digest('hex')
}

export async function getExistingTokenEntry(accessToken) {
  const tokenHash = hashRefreshToken(accessToken)
  return await init.RefreshToken.findOne({ where: { token: tokenHash } })
}

export async function linkReplacedToken(oldTokenId, newTokenId) {
  const token = await init.RefreshToken.findOne({ where: { id: oldTokenId } })

  if (token === null) {
    return false
  }

  token.replacedByTokenId = newTokenId
  await token.save()

  return true
}

export async function revokeToken(tokenId) {
  const token = await init.RefreshToken.findOne({ where: { id: tokenId } })

  if (token === null) {
    return false
  }

  if (token.revoked === false) {
    token.revoked = true
    await token.save()
  }

  return true
}

export async function store(token) {
  const tokenHash = hashRefreshToken(token.token)
  return await init.RefreshToken.create({ ...token, token: tokenHash })
}
