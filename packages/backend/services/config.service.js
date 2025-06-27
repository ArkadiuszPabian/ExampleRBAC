export default {
  authCookieName: process.env.AUTH_COOKIE_NAME || 'auth_token',
  jwtSecret: process.env.JWT_SECRET,
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  tokenLifetime: Number(process.env.TOKEN_LIFETIME) || 15 * 60,
  environment: process.env.NODE_ENV,
  frontendAddress: process.env.FRONTEND_ADDRESS,
  sslKeyPath: process.env.SSL_KEY_PATH || './ssl/server.key',
  sslCertPath: process.env.SSL_CERT_PATH || './ssl/server.cert',
}
