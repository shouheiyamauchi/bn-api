import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

import * as userController from './controllers/user'
import './db'

export const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log(req.body)
  res.send('hello world')
})

app.post('/users/register', userController.register)
app.post('/users/login', userController.login)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Breakinotes running on port ${port}`)
})
