import * as controller from '../controllers/login.controller.js'

export function registerRoutes(app) {
  app.post('/login', controller.loginAction)

  return app
}
