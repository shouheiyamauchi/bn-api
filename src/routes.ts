import { Express } from 'express'

import * as userController from './controllers/user'
import passport from './middleware/auth'

export default (app: Express) => {
  // endpoints not requiring authentication
  app.post('/users/register', userController.register)
  app.post('/users/login', userController.login)

  // endpoints requiring authentication
  app.use(passport.initialize())
  app.use(passport.authenticate('jwt', { session: false }))
}
