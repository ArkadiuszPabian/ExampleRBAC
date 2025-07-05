import init from '../models/init.model.js'

export async function getExistingTokenEntry(accessToken) {
  return await init.RefreshToken.findOne({ where: { token: accessToken } })
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
  return await init.RefreshToken.create(token)
}
