import config from './config.service.js'

// TLS terminates at the Kubernetes Gateway API ingress, so the refresh-token
// cookie is always marked Secure + SameSite=strict. Express trusts the first
// proxy hop (see app.js), so the Secure attribute is honored even though the
// in-cluster connection between gateway and Service is plain HTTP.
const cookieSettings = {
  httpOnly: true, // prevents JS access on client side
  secure: true,
  sameSite: 'strict', // prevent CSRF
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
