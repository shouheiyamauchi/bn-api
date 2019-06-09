import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import { Status } from '../utils/http'

const DUPLICATE_ERROR = 'Duplicate username'
const SALT_ROUNDS = 10

export const register = async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body

  try {
    if (await User.findOne({ username })) {
      throw 422
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const newUser = new User({ username, password: hash })
    const user = await newUser.save()

    const payload = { id: user._id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3h'
    })

    res.status(200).send({ code: Status.Success, data: token })
  } catch (err) {
    if (err === 422) {
      res.status(422).send({ code: Status.Error, data: DUPLICATE_ERROR })
    } else {
      res.status(500).send({ code: Status.Error, data: err })
    }
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body

  User.findOne({ username })
    .exec()
    .then(async (user) => ({
      correctPassword: await bcrypt.compare(password, user.password),
      user
    }))
    .then(({ correctPassword, user }) => {
      if (!correctPassword) {
        throw new Error()
      }

      const payload = { id: user._id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '3h'
      })

      res.status(200).send({ code: Status.Success, data: token })
    })
    .catch(() => {
      res.status(401).send({
        code: Status.Error,
        data: 'Invalid username and password combination'
      })
    })
}
