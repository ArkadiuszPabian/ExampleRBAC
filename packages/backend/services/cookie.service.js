import config from './config.service.js'

const cookieSettings = {
  httpOnly: true, // prevents JS access on client side
  secure: config.isSSL, // true if using HTTPS
  sameSite: config.isSSL ? 'strict' : 'lax', // prevent CSRF
  path: '/',
  maxAge: config.refreshTokenLifetimeInMs,
}

export default {
  getCookie: (cookieName, request) => {
    return request.cookies[cookieName]
  },
  setCookie: (cookieName, response, token) => {
    response.cookie(cookieName, token, cookieSettings)

    return response
  },
  clearCookie: (cookieName, response) => {
    response.clearCookie(cookieName, cookieSettings)

    return response
  },
}
