import * as argon2 from 'argon2'

export async function hashPassword(plainTextPassword) {
  let hash
  try {
    hash = await argon2.hash(plainTextPassword)
  } catch (err) {
    console.error('Password cannot be hashed', err)
    return null
  }

  return hash
}

export async function verifyPassword(plainTextPassword, hashedPassword) {
  let isPasswordVerified

  try {
    isPasswordVerified = await argon2.verify(hashedPassword, plainTextPassword)
  } catch (err) {
    console.error('Password cannot be verified', err)
    return null
  }

  return isPasswordVerified
}
