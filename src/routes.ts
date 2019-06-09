import { Express } from 'express'

import * as categoryController from './controllers/category'
import * as moveController from './controllers/move'
import * as multimediaController from './controllers/multimedia'
import * as tagController from './controllers/tag'
import * as transitionController from './controllers/transition'
import * as userController from './controllers/user'
import passport from './middleware/auth'
import { Status } from './utils/http'

export default (app: Express) => {
  // endpoints not requiring authentication
  app.post('/users/register', userController.register)
  app.post('/users/login', userController.login)

  // endpoints requiring authentication
  app.use(passport.initialize())
  app.use((req, res, next) =>
    passport.authenticate('jwt', { session: false }, (_, user) => {
      if (!user) {
        return res
          .status(401)
          .send({ code: Status.Error, data: 'Unauthorized' })
      } else {
        req.user = user
        next()
      }
    })(req, res, next)
  )

  app.post('/categories', categoryController.create)
  app.get('/categories', categoryController.list)
  app.get('/categories/:id', categoryController.get)
  app.put('/categories/:id', categoryController.update)
  app.post('/categories/nested', categoryController.nested)

  app.post('/moves', moveController.create)
  app.get('/moves', moveController.list)
  app.get('/moves/:id', moveController.get)
  app.put('/moves/:id', moveController.update)

  app.post('/multimedia', multimediaController.create)
  app.get('/multimedia', multimediaController.list)
  app.get('/multimedia/:id', multimediaController.get)
  app.put('/multimedia/:id', multimediaController.update)

  app.post('/tags', tagController.create)
  app.get('/tags', tagController.list)
  app.get('/tags/:id', tagController.get)
  app.put('/tags/:id', tagController.update)

  app.post('/transitions', transitionController.create)
  app.get('/transitions', transitionController.list)
  app.get('/transitions/:id', transitionController.get)
  app.put('/transitions/:id', transitionController.update)
}
