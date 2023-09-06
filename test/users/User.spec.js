/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { after, before, beforeEach, describe, it } from 'mocha'
import supertest from 'supertest'
import { app } from '../../src/app.js'
import { ADMIN_PASS, ADMIN_USER, MULTER_MAX_FILE_SIZE_MB } from '../../src/constants/envVars.js'
import { deleteRandomFiles, dropAllCollections, generateRandomFiles } from '../helpers.js'

const requester = supertest(app)

describe('/api/users - Tests User endpoints', function () {
  const mockUser = {
    firstName: 'test',
    lastName: 'test',
    email: 'test@test.com',
    password: 'test',
    age: 20,
  }
  // eslint-disable-next-line no-unused-vars
  let files

  before(function () {
    this.files = generateRandomFiles({ numberOfFiles: 4, maxSizeInMB: MULTER_MAX_FILE_SIZE_MB })
  })

  beforeEach(function (done) {
    dropAllCollections().then(async () => {
      await requester.post('/api/sessions/register').send(mockUser)
      done()
    })
  })

  after(function (done) {
    dropAllCollections().then(() => {
      deleteRandomFiles()
      done()
    })
  })

  describe('POST /api/users/:uid/documents', function () {
    it('should return 401 if user is not logged in', async function () {
      const response = await requester.post('/api/users/1234/documents').send()

      expect(response.statusCode).to.be.equal(401)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('No auth token')
    })

    it('should return 403 if user is admin', async function () {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const uid = 'anything'

      const response = await requester
        .post(`/api/users/${uid}/documents`)
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(403)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('Forbidden')
    })

    it('should return 400 if uid is not a valid user id', async function () {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const uid = '123456'

      const response = await requester
        .post(`/api/users/${uid}/documents`)
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal(`The provided id (${uid}) isn't valid`)
    })

    it('should return 401 if uid is not the same as the logged user', async function () {
      const { body, headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      // change last char of uid
      const uid = `${body.payload.id.slice(0, -1)}1`

      const response = await requester
        .post(`/api/users/${uid}/documents`)
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(401)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('Unauthorized')
    })

    it('should return 400 if no files are uploaded', async function () {
      const { body, headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const uid = body.payload.id

      const response = await requester
        .post(`/api/users/${uid}/documents`)
        .set('Cookie', headers['set-cookie'])

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('No files uploaded')
    })

    it('should return 200 if files are valid', async function () {
      const { body, headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const uid = body.payload.id

      const response = await requester
        .post(`/api/users/${uid}/documents`)
        .set('Cookie', headers['set-cookie'])
        .attach('documents', this.files[1])
        .attach('documents', this.files[2])

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body).to.have.property('message').to.be.equal('Files uploaded')
      expect(response.body).to.have.property('payload').to.be.an('array')
      expect(response.body.payload).to.have.lengthOf(2)
    })

    it(`should return 400 if files are not valid - more heavier than ${MULTER_MAX_FILE_SIZE_MB} MB`, async function () {
      const { body, headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const uid = body.payload.id

      const file = generateRandomFiles({
        numberOfFiles: 1,
        specificSizeInMB: MULTER_MAX_FILE_SIZE_MB + 1,
      })

      const fieldName = 'documents'

      const response = await requester
        .post(`/api/users/${uid}/documents`)
        .set('Cookie', headers['set-cookie'])
        .attach(fieldName, file[0])

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal(`File too large in field "${fieldName}"`)
    })
  })
})
