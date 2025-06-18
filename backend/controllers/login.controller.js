import * as dbUsersService from '../services/db-users.service.js'
import * as hashService from '../services/hash.service.js'
import * as tokenService from '../services/token.service.js'

/**
 * Action used to log in the user.
 */
export async function loginAction(request, response) {
  try {
    if (request.body.username === undefined) {
      return response.status(400).send({
        reason: 'Username not provided',
      })
    }

    if (request.body.password === undefined) {
      return response.status(400).send({
        reason: 'Password not provided',
      })
    }

    // We skip other validation intentionally, for simplicity -
    // for production app, we should have validation service that makes sure
    // provided data comply with our validation rules

    const { username, password } = request.body

    const user = await dbUsersService.getUserByUsername(username)

    if (user === null) {
      return response.status(401).send({
        reason: 'Username and / or password is invalid',
      })
    }

    const passwordVerified = await hashService.verifyPassword(
      password,
      user.hashedPassword
    )

    if (passwordVerified === null) {
      return response.status(500).send({
        reason: 'Internal Server Error',
      })
    }

    if (passwordVerified === false) {
      return response.status(401).send({
        reason: 'Username and / or password is invalid',
      })
    }

    const token = tokenService.generateToken(user.id, username, user.role)

    response
      .status(204)
      .cookie('access_token', token, {
        httpOnly: true, // prevents JS access on client side
        secure: false, // true if using HTTPS
        sameSite: 'strict', // prevent CSRF
        maxAge: 3600000, // 1 hour
      })
      .send()
  } catch (error) {
    console.log({ error })
    response.status(500).send()
  }
}
