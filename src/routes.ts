import { Express } from 'express'

import * as categoryController from './controllers/category'
import * as tagController from './controllers/tag'
import * as userController from './controllers/user'
import passport from './middleware/auth'

export default (app: Express) => {
  // endpoints not requiring authentication
  app.post('/users/register', userController.register)
  app.post('/users/login', userController.login)

  // endpoints requiring authentication
  app.use(passport.initialize())
  app.use(passport.authenticate('jwt', { session: false }))

  app.post('/categories', categoryController.create)
  app.get('/categories', categoryController.list)
  app.get('/categories/:id', categoryController.get)
  app.put('/categories/:id', categoryController.update)

  app.post('/tags', tagController.create)
  app.get('/tags', tagController.list)
  app.get('/tags/:id', tagController.get)
  app.put('/tags/:id', tagController.update)
}
