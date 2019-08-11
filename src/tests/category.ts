import chai, { expect } from 'chai'
import chaiShallowDeepEqual from 'chai-shallow-deep-equal'

import { Status } from '../utils/http'
import {
  chaiRequest,
  clearDb,
  generateDummyObjectId,
  newUserAuthHeader
} from '../utils/tests'

chai.use(chaiShallowDeepEqual)

describe('/categories', () => {
  const requester = chaiRequest()

  afterEach(async () => {
    await clearDb()
  })

  describe('POST /', () => {
    it('should not be able to create a category without logging in', async () => {
      const request = await requester.post('/categories').send()

      expect(request.body.code).to.equal(Status.Error)
      expect(request.status).to.equal(401)
    })

    it('should be able to create a category', async () => {
      const authHeader = await newUserAuthHeader('user')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      const request = await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send(categoryData)

      expect(request.body.code).to.equal(Status.Success)
      expect(request.body.data).to.shallowDeepEqual(categoryData)
      expect(request.status).to.equal(200)
    })

    it('should not be able to create a category without color', async () => {
      const authHeader = await newUserAuthHeader('user')

      const request = await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send({
          name: 'some name'
        })

      expect(request.body.code).to.equal(Status.Error)
      expect(request.status).to.equal(500)
    })

    it('should not be able to create a category without name', async () => {
      const authHeader = await newUserAuthHeader('user')

      const request = await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send({
          color: 'red'
        })

      expect(request.body.code).to.equal(Status.Error)
      expect(request.status).to.equal(500)
    })

    it('should not be able to create a category with same name', async () => {
      const authHeader = await newUserAuthHeader('user')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      const request1 = await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send(categoryData)

      const request2 = await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send(categoryData)

      expect(request1.body.code).to.equal(Status.Success)
      expect(request1.body.data).to.shallowDeepEqual(categoryData)
      expect(request1.status).to.equal(200)
      expect(request2.body.code).to.equal(Status.Error)
      expect(request2.status).to.equal(422)
    })

    it('should be able to create a category with same name for different users', async () => {
      const authHeader1 = await newUserAuthHeader('user1')
      const authHeader2 = await newUserAuthHeader('user2')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      const request1 = await requester
        .post('/categories')
        .set('Authorization', authHeader1)
        .send(categoryData)

      const request2 = await requester
        .post('/categories')
        .set('Authorization', authHeader2)
        .send(categoryData)

      expect(request1.body.code).to.equal(Status.Success)
      expect(request1.body.data).to.shallowDeepEqual(categoryData)
      expect(request1.status).to.equal(200)
      expect(request2.body.code).to.equal(Status.Success)
      expect(request2.body.data).to.shallowDeepEqual(categoryData)
      expect(request2.status).to.equal(200)
    })
  })

  describe('GET /', () => {
    it('should not be able to list categories without logging in', async () => {
      const request = await requester.get('/categories').send()

      expect(request.body.code).to.equal(Status.Error)
      expect(request.status).to.equal(401)
    })

    it('should return an empty array of categories', async () => {
      const authHeader = await newUserAuthHeader('user')

      const request = await requester
        .get('/categories')
        .set('Authorization', authHeader)
        .send()

      expect(request.body.code).to.equal(Status.Success)
      expect(request.body.data.length).to.equal(0)
      expect(request.status).to.equal(200)
    })

    it('should return an array of 1 category', async () => {
      const authHeader = await newUserAuthHeader('user')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send(categoryData)

      const request = await requester
        .get('/categories')
        .set('Authorization', authHeader)
        .send()

      expect(request.body.code).to.equal(Status.Success)
      expect(request.body.data.length).to.equal(1)
      expect(request.body.data).to.shallowDeepEqual([categoryData])
      expect(request.status).to.equal(200)
    })

    it('should return an array of multiple categories', async () => {
      const authHeader = await newUserAuthHeader('user')

      const categoryData1 = {
        color: 'red',
        name: 'some name'
      }

      const categoryData2 = {
        color: 'red',
        name: 'some name 2'
      }

      await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send(categoryData1)

      await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send(categoryData2)

      const request = await requester
        .get('/categories')
        .set('Authorization', authHeader)
        .send()

      expect(request.body.code).to.equal(Status.Success)
      expect(request.body.data.length).to.equal(2)
      expect(request.body.data).to.shallowDeepEqual([
        categoryData1,
        categoryData2
      ])
      expect(request.status).to.equal(200)
    })

    it('should return an array of current user categories', async () => {
      const authHeader1 = await newUserAuthHeader('user1')
      const authHeader2 = await newUserAuthHeader('user2')

      const categoryData1 = {
        color: 'red',
        name: 'some name'
      }

      const categoryData2 = {
        color: 'red',
        name: 'some name 2'
      }

      await requester
        .post('/categories')
        .set('Authorization', authHeader1)
        .send(categoryData1)

      await requester
        .post('/categories')
        .set('Authorization', authHeader2)
        .send(categoryData2)

      const request1 = await requester
        .get('/categories')
        .set('Authorization', authHeader1)
        .send()

      const request2 = await requester
        .get('/categories')
        .set('Authorization', authHeader2)
        .send()

      expect(request1.body.code).to.equal(Status.Success)
      expect(request1.body.data.length).to.equal(1)
      expect(request1.body.data).to.shallowDeepEqual([categoryData1])
      expect(request1.status).to.equal(200)
      expect(request2.body.code).to.equal(Status.Success)
      expect(request2.body.data.length).to.equal(1)
      expect(request2.body.data).to.shallowDeepEqual([categoryData2])
      expect(request2.status).to.equal(200)
    })
  })

  describe('GET /:id', () => {
    it('should not be able to get without logging in', async () => {
      const authHeader = await newUserAuthHeader('user')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      const request1 = await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send(categoryData)

      const request2 = await requester
        .get(`/categories/${request1.body.data._id}`)
        .send()

      expect(request2.body.code).to.equal(Status.Error)
      expect(request2.status).to.equal(401)
    })

    it('should be able to get category', async () => {
      const authHeader = await newUserAuthHeader('user')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      const request1 = await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send(categoryData)

      const request2 = await requester
        .get(`/categories/${request1.body.data._id}`)
        .set('Authorization', authHeader)
        .send()

      expect(request2.body.code).to.equal(Status.Success)
      expect(request2.body.data).to.shallowDeepEqual(categoryData)
      expect(request2.status).to.equal(200)
    })

    it('should not be able to get non-existent category', async () => {
      const authHeader = await newUserAuthHeader('user')

      const request = await requester
        .get(`/categories/${generateDummyObjectId()}`)
        .set('Authorization', authHeader)
        .send()

      expect(request.body.code).to.equal(Status.Error)
      expect(request.status).to.equal(404)
    })

    it('should not be able to get other user category', async () => {
      const authHeader1 = await newUserAuthHeader('user1')
      const authHeader2 = await newUserAuthHeader('user2')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      const request1 = await requester
        .post('/categories')
        .set('Authorization', authHeader1)
        .send(categoryData)

      const request2 = await requester
        .get(`/categories/${request1.body.data._id}`)
        .set('Authorization', authHeader2)
        .send()

      expect(request2.body.code).to.equal(Status.Error)
      expect(request2.status).to.equal(404)
    })
  })

  describe('PUT /:id', () => {
    it('should not be able to update without logging in', async () => {
      const authHeader = await newUserAuthHeader('user')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      const updatedCategoryData = {
        ...categoryData,
        color: 'pink'
      }

      const request1 = await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send(categoryData)

      const request2 = await requester
        .put(`/categories/${request1.body.data._id}`)
        .send(updatedCategoryData)

      expect(request2.body.code).to.equal(Status.Error)
      expect(request2.status).to.equal(401)
    })

    it('should be able to update category', async () => {
      const authHeader = await newUserAuthHeader('user')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      const updatedCategoryData = {
        ...categoryData,
        color: 'pink'
      }

      const request1 = await requester
        .post('/categories')
        .set('Authorization', authHeader)
        .send(categoryData)

      const request2 = await requester
        .put(`/categories/${request1.body.data._id}`)
        .set('Authorization', authHeader)
        .send(updatedCategoryData)

      const request3 = await requester
        .get(`/categories/${request1.body.data._id}`)
        .set('Authorization', authHeader)
        .send()

      expect(request1.body.code).to.equal(Status.Success)
      expect(request1.body.data).to.shallowDeepEqual(categoryData)
      expect(request1.status).to.equal(200)
      expect(request2.body.code).to.equal(Status.Success)
      expect(request2.body.data).to.shallowDeepEqual(updatedCategoryData)
      expect(request2.status).to.equal(200)
      expect(request3.body.code).to.equal(Status.Success)
      expect(request3.body.data).to.shallowDeepEqual(updatedCategoryData)
      expect(request3.status).to.equal(200)
    })

    it('should not be able to update non-existent category', async () => {
      const authHeader = await newUserAuthHeader('user')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      const request = await requester
        .put(`/categories/${generateDummyObjectId()}`)
        .set('Authorization', authHeader)
        .send(categoryData)

      expect(request.body.code).to.equal(Status.Error)
      expect(request.status).to.equal(404)
    })

    it('should not be able to update other user category', async () => {
      const authHeader1 = await newUserAuthHeader('user1')
      const authHeader2 = await newUserAuthHeader('user2')

      const categoryData = {
        color: 'red',
        name: 'some name'
      }

      const updatedCategoryData = {
        ...categoryData,
        color: 'pink'
      }

      const request1 = await requester
        .post('/categories')
        .set('Authorization', authHeader1)
        .send(categoryData)

      const request2 = await requester
        .put(`/categories/${request1.body.data._id}`)
        .set('Authorization', authHeader2)
        .send(updatedCategoryData)

      expect(request2.body.code).to.equal(Status.Error)
      expect(request2.status).to.equal(404)
    })
  })

  // describe('POST /nested', () => {})
})
