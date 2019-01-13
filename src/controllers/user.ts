import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/User'

const SALT_ROUNDS = 10

export const register = (req: express.Request, res: express.Response) => {
  const { username, password } = req.body

  bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
    const newUser = new User({ username, password: hash })

    newUser.save()
      .then((user) => {
        res.status(200).send(user)
      })
      .catch((err) => {
        res.status(500).send(err)
      })
  })
}

export const login = (req: express.Request, res: express.Response) => {
  const { username, password } = req.body

  User.findOne({ username }).exec()
    .then((user) => ({ correctPassword: bcrypt.compare(password, user.password), user }))
    .then(({ correctPassword, user }) => {
      if (!correctPassword) {
        throw new Error()
      }

      const payload = { id: user._id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' })

      res.status(200).send({ msg: 'Successful login', token })
    })
    .catch(() => {
      res.status(401).send({ msg: 'Invalid username and password combination' })
    })
}
