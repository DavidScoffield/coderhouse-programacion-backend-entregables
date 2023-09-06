/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import fs from 'fs'
import { after, beforeEach, describe, it } from 'mocha'
import supertest from 'supertest'
import { app } from '../../src/app.js'
import { MULTER_PATH_FOLDER } from '../../src/constants/constants.js'
import {
  ADMIN_PASS,
  ADMIN_USER,
  MULTER_DEST,
  MULTER_MAX_FILE_SIZE_MB,
} from '../../src/constants/envVars.js'
import { createRandomFilesInMemory, deleteRandomFiles, dropAllCollections } from '../helpers.js'
const requester = supertest(app)

describe('/api/users - Tests User endpoints', function () {
  const mockUser = {
    firstName: 'test',
    lastName: 'test',
    email: 'test@test.com',
    password: 'test',
    age: 20,
  }

  beforeEach(function (done) {
    dropAllCollections().then(async () => {
      await deleteRandomFiles(MULTER_PATH_FOLDER)
      await requester.post('/api/sessions/register').send(mockUser)
      done()
    })
  })

  after(function (done) {
    dropAllCollections().then(async () => {
      await deleteRandomFiles()
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

      const uids = ['64f87b38c2e0cab9b3f451d5', '64f87af5ad8908985256485f']

      const uid = body.payload.id !== uids[0] ? uids[0] : uids[1]

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

    it(`should return 400 if files are not valid - more heavier than ${MULTER_MAX_FILE_SIZE_MB} MB`, async function () {
      const { body, headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const uid = body.payload.id

      const file = createRandomFilesInMemory({
        numberOfFiles: 1,
        specificSizeInMB: MULTER_MAX_FILE_SIZE_MB + 1,
      })

      const fieldName = 'documents'

      const response = await requester
        .post(`/api/users/${uid}/documents`)
        .set('Cookie', headers['set-cookie'])
        .attach(fieldName, file[0].content, file[0].name)

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal(`File too large in field "${fieldName}"`)
    })

    it('should return 200 if files are valid - in documents', async function () {
      const filesToUse = createRandomFilesInMemory({ numberOfFiles: 2, maxSizeInMB: 10 })

      const { body, headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const uid = body.payload.id

      const response = await requester
        .post(`/api/users/${uid}/documents`)
        .set('Cookie', headers['set-cookie'])
        .attach('documents', filesToUse[0].content, filesToUse[0].name)
        .attach('documents', filesToUse[1].content, filesToUse[1].name)

      const files = fs.readdirSync(`${MULTER_DEST}/documents`)

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body).to.have.property('message').to.be.equal('Files uploaded')
      expect(response.body).to.have.property('payload').to.be.an('object')
      expect(response.body.payload).to.have.property('documents').to.be.an('array')
      expect(response.body.payload).to.have.property('profile').to.be.an('array')
      expect(response.body.payload.documents).to.have.lengthOf(2)
      expect(response.body.payload.profile).to.have.lengthOf(0)

      expect(files).to.have.lengthOf(2)
      expect(files[0]).to.be.match(new RegExp(filesToUse[0].name))
      expect(files[1]).to.be.match(new RegExp(filesToUse[1].name))
    })

    it('should return 200 if file is valid - in profiles', async function () {
      const filesToUse = createRandomFilesInMemory({ numberOfFiles: 1, maxSizeInMB: 5 })

      const { body, headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const uid = body.payload.id

      const response = await requester
        .post(`/api/users/${uid}/documents`)
        .set('Cookie', headers['set-cookie'])
        .attach('profiles', filesToUse[0].content, filesToUse[0].name)

      const files = fs.readdirSync(`${MULTER_DEST}/profiles`)

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body).to.have.property('message').to.be.equal('Files uploaded')
      expect(response.body).to.have.property('payload').to.be.an('object')
      expect(response.body.payload).to.have.property('documents').to.be.an('array')
      expect(response.body.payload).to.have.property('profile').to.be.an('array')
      expect(response.body.payload.documents).to.have.lengthOf(0)
      expect(response.body.payload.profile).to.have.lengthOf(1)

      expect(files).to.have.lengthOf(1)
      expect(files[0]).to.be.match(new RegExp(filesToUse[0].name))
    })

    it('should return 400 if pass more than 1 file - in profiles', async function () {
      const { body, headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const uid = body.payload.id

      const generatedFiles = createRandomFilesInMemory({ numberOfFiles: 2, maxSizeInMB: 5 })

      const response = await requester
        .post(`/api/users/${uid}/documents`)
        .set('Cookie', headers['set-cookie'])
        .set('Connection', 'keep-alive')
        .set('Keep-Alive', 'timeout=5, max=1000')
        .attach('profiles', generatedFiles[0].content, generatedFiles[0].name)
        .attach('profiles', generatedFiles[1].content, generatedFiles[0].name)

      const uploadedFiles = await fs.promises.readdir(`${MULTER_DEST}/profiles`)

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal('Unexpected field in field "profiles"')
      expect(response.body).to.not.have.property('payload')

      expect(uploadedFiles).to.have.lengthOf(0)
    })
  })
})
