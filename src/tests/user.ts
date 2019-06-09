import { expect } from 'chai'

import { Status } from '../utils/http'
import { chaiRequest, clearDb } from '../utils/tests'

describe('/users', () => {
  const requester = chaiRequest()

  afterEach(async () => {
    await clearDb()
  })

  describe('POST /register', () => {
    it('should create an account successfully', async () => {
      const request = await requester.post('/users/register').send({
        password: 'password',
        username: 'user'
      })

      expect(request.body.code).to.equal(Status.Success)
      expect(request.status).to.equal(200)
    })

    it('should not allow an existing account name', async () => {
      const request1 = await requester.post('/users/register').send({
        password: 'password',
        username: 'user'
      })

      const request2 = await requester.post('/users/register').send({
        password: 'password2',
        username: 'user'
      })

      expect(request1.body.code).to.equal(Status.Success)
      expect(request1.status).to.equal(200)
      expect(request2.body.code).to.equal(Status.Error)
      expect(request2.status).to.equal(422)
    })
  })

  describe('POST /login', () => {
    it('should be able to login successfully with correct credentials', async () => {
      await requester.post('/users/register').send({
        password: 'password',
        username: 'user'
      })

      const request = await requester.post('/users/login').send({
        password: 'password',
        username: 'user'
      })

      expect(request.body.code).to.equal(Status.Success)
      expect(request.status).to.equal(200)
    })

    it('should not be able to login successfully with incorrect credentials', async () => {
      await requester.post('/users/register').send({
        password: 'password',
        username: 'user'
      })

      const request = await requester.post('/users/login').send({
        password: 'password2',
        username: 'user'
      })

      expect(request.body.code).to.equal(Status.Error)
      expect(request.status).to.equal(401)
    })
  })
})
