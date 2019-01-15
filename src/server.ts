import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

import './db'
import routes from './routes'

export const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

routes(app)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Breakinotes running on port ${port}`)
})
