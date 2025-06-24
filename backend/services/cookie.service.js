import config from '../services/config.service.js'

const cookieSettings = {
  httpOnly: true, // prevents JS access on client side
  secure: false, // true if using HTTPS
  sameSite: 'strict', // prevent CSRF
  path: '/',
  maxAge: 1000 * config.tokenLifetime,
}

export default {
  getCookie: (request) => {
    return request.cookies[config.authCookieName]
  },
  setCookie: (response, token) => {
    response.cookie(config.authCookieName, token, cookieSettings)

    return response
  },
  clearCookie: (response) => {
    response.clearCookie(config.authCookieName, cookieSettings)

    return response
  },
}
