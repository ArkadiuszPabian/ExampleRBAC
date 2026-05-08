import ms from 'ms'

export default {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  host: process.env.HOST || '0.0.0.0',
  accessTokenLifetime: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenLifetime: process.env.REFRESH_TOKEN_TTL || '7d',
  refreshTokenLifetimeInMs: process.env.REFRESH_TOKEN_TTL
    ? ms(process.env.REFRESH_TOKEN_TTL)
    : ms('7d'),
  loginSessionLifetimeInMs: process.env.LOGIN_SESSION_TTL
    ? ms(process.env.LOGIN_SESSION_TTL)
    : ms('30d'),
  environment: process.env.NODE_ENV,
  frontendAddress: process.env.FRONTEND_ADDRESS || 'http://localhost:4200',
  refreshTokenCookieName: 'refresh_token',
}
