export default {
  authCookieName: process.env.AUTH_COOKIE_NAME || 'auth_token',
  jwtSecret: process.env.JWT_SECRET,
  port: Number(process.env.PORT) || 3000,
  tokenLifetime: Number(process.env.TOKEN_LIFETIME) || 15 * 60,
}
