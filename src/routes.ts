import { Express } from 'express'

import * as categoryController from './controllers/category'
import * as moveController from './controllers/move'
import * as multimediaController from './controllers/multimedia'
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

  app.post('/moves', moveController.create)
  app.get('/moves', moveController.list)
  app.get('/moves/:id', moveController.get)
  app.put('/moves/:id', moveController.update)

  app.post('/multimedia', multimediaController.create)
  app.get('/multimedia/:id', multimediaController.get)
  app.put('/multimedia/:id', multimediaController.update)
}
