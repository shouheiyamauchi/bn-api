import chai from 'chai'
import chaiHttp from 'chai-http'
import mongoose from 'mongoose'

import app from '../server'

chai.use(chaiHttp)

export const chaiRequest = () => chai.request(app).keepOpen()

export const clearDb = () => mongoose.connection.db.dropDatabase()

export const newUserAuthHeader = async (username: string) => {
  const request = await chaiRequest()
    .post('/users/register')
    .send({
      password: 'password',
      username
    })

  return `jwt ${request.body.data}`
}

export const generateDummyObjectId = () => mongoose.Types.ObjectId()
