import passport from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import User from '../models/User'

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET
}

const strategy = new Strategy(jwtOptions, (jwtPayload, done) => {
  User.findById(jwtPayload.id)
    .then((user) => {
      done(null, user)
    })
    .catch(() => {
      done(null, false)
    })
})

passport.use(strategy)

export default passport
