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
import UserManager from '../../src/dao/mongo/managers/user.manager.js'
import { generateUser } from '../../src/mocks/users.mocks.js'
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
  let user

  beforeEach(function (done) {
    dropAllCollections().then(async function () {
      await deleteRandomFiles(MULTER_PATH_FOLDER)
      const { body } = await requester.post('/api/sessions/register').send(mockUser)
      user = body.payload
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

  describe('PUT /api/users/premium/:uid', function () {
    it('should return 401 if user is not logged in', async function () {
      const response = await requester.put('/api/users/premium/1234').send()

      expect(response.statusCode).to.be.equal(401)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('No auth token')
    })

    it('should return 403 if user is not admin', async function () {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const uid = 'anything'

      const response = await requester
        .put(`/api/users/premium/${uid}`)
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(403)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('Forbidden')
    })

    it('should return 400 if uid is not a valid user id', async function () {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const uid = '123456'

      const response = await requester
        .put(`/api/users/premium/${uid}`)
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal(`The provided id (${uid}) isn't valid`)
    })

    it('should return 400 if user not exist', async function () {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const uid = '64f87b38c2e0cab9b3f451d5'

      const response = await requester
        .put(`/api/users/premium/${uid}`)
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(404)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal(`User with id "${uid}" not found`)
    })

    it('should return 400 if try to update a user (USER) to PREMIUM that not have no all neccesary documents loaded', async function () {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const uid = user._id

      const response = await requester
        .put(`/api/users/premium/${uid}`)
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal(
          `User with id "${uid}" has not all the necessary documents to be premium. Missing files: identification, proofOfAddress, proofOfAccountState`
        )
    })

    it('should return 200 if user (USER) is updated to PREMIUM', async function () {
      // --- load files in user --- //
      const filesToUse = {
        identification: createRandomFilesInMemory({
          numberOfFiles: 1,
          maxSizeInMB: 5,
          predefinedFileName: 'identification',
        }),
        proofOfAddress: createRandomFilesInMemory({
          numberOfFiles: 1,
          maxSizeInMB: 5,
          predefinedFileName: 'proofOfAddress',
        }),
        proofOfAccountState: createRandomFilesInMemory({
          numberOfFiles: 1,
          maxSizeInMB: 5,
          predefinedFileName: 'proofOfAccountState',
        }),
      }

      const { body, headers: headersUser } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      await requester
        .post(`/api/users/${body.payload.id}/documents`)
        .set('Cookie', headersUser['set-cookie'])
        .attach(
          'documents',
          filesToUse.identification[0].content,
          filesToUse.identification[0].name
        )
        .attach(
          'documents',
          filesToUse.proofOfAddress[0].content,
          filesToUse.proofOfAddress[0].name
        )
        .attach(
          'documents',
          filesToUse.proofOfAccountState[0].content,
          filesToUse.proofOfAccountState[0].name
        )
      // ---  end load files in user  --- //

      const { headers: headersAdmin } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const uid = user._id

      const response = await requester
        .put(`/api/users/premium/${uid}`)
        .set('Cookie', headersAdmin['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body)
        .to.have.property('message')
        .to.be.equal(`Switch role user from USER to PREMIUM`)
      expect(response.body).to.have.property('payload').to.be.an('object')
      expect(response.body.payload)
        .to.have.property('name')
        .to.be.equal(`${mockUser.firstName} ${mockUser.lastName}`)
      expect(response.body.payload).to.have.property('email').to.be.equal(mockUser.email)
      expect(response.body.payload).to.have.property('age').to.be.equal(mockUser.age)
      expect(response.body.payload).to.have.property('role').to.be.equal('PREMIUM')
      expect(response.body.payload).to.have.property('cart').to.be.a('string')
    })

    it('should return 200 if user (PREMIUM) is updated to (USER)', async function () {
      const userDAO = new UserManager()
      const mockPremiumUser = {
        firstName: 'test',
        lastName: 'test',
        email: 'test@premium.com',
        password: 'test',
        age: 20,
        role: 'PREMIUM',
      }

      const newPremiumUser = await userDAO.addUser(mockPremiumUser)

      expect(newPremiumUser).to.have.property('documents').to.be.an('array').and.be.empty

      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const uid = newPremiumUser._id

      const response = await requester
        .put(`/api/users/premium/${uid}`)
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body)
        .to.have.property('message')
        .to.be.equal(`Switch role user from PREMIUM to USER`)
      expect(response.body).to.have.property('payload').to.be.an('object')
      expect(response.body.payload)
        .to.have.property('name')
        .to.be.equal(`${mockPremiumUser.firstName} ${mockPremiumUser.lastName}`)
      expect(response.body.payload).to.have.property('email').to.be.equal(mockPremiumUser.email)
      expect(response.body.payload).to.have.property('age').to.be.equal(mockPremiumUser.age)
      expect(response.body.payload).to.have.property('role').to.be.equal('USER')
      expect(response.body.payload).to.have.property('cart')
    })
  })

  describe('/api/users - GET - Get all users', function () {
    let userMocks

    beforeEach(async () => {
      const userDAO = new UserManager()
      userMocks = Array.from({ length: 3 }, () => generateUser())

      await Promise.all(userMocks.map((user) => userDAO.addUser(user)))
    })

    it('should return 200 and return all users', async function () {
      const response = await requester.get('/api/users').send()

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body).to.have.property('message').to.be.equal('Users found')
      expect(response.body).to.have.property('payload').to.be.an('array')
      expect(response.body.payload).to.have.lengthOf(4)

      const users = response.body.payload

      users.forEach((user) => {
        expect(user).not.have.property('id')
        expect(user).to.have.property('name')
        expect(user).to.have.property('email')
        expect(user).to.have.property('age')
        expect(user).to.have.property('role')
        expect(user).to.have.property('cart')

        // expect(user).to.have.property('lastConnection')
        // expect(user).to.have.property('documents')
      })
    })
  })

  describe('/api/users - DELETE - Delete inactive users', function () {
    it('should return 403 if user is not admin', async function () {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const response = await requester
        .delete('/api/users')
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(403)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('Forbidden')
    })

    it('should return 200 and delete all inactive users', async function () {
      const userDAO = new UserManager()

      // Create users
      const userMocks = Array.from({ length: 3 }, () => generateUser())
      const newUsers = await Promise.all(userMocks.map((user) => userDAO.addUser(user)))

      // Update lastConnection
      const dayAndHalfInMs = 1.5 * 24 * 60 * 60 * 1000
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000

      await Promise.all([
        userDAO.updateUser(newUsers[0]._id, {
          lastConnection: new Date(Date.now() - dayAndHalfInMs),
        }),
        userDAO.updateUser(newUsers[1]._id, {
          lastConnection: new Date(Date.now() - threeDaysInMs),
        }),
        userDAO.updateUser(newUsers[2]._id, { lastConnection: new Date() }),
      ])

      // Test delete inactive users
      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const response = await requester
        .delete('/api/users')
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body).to.have.property('message').to.be.equal('Users deleted')
      expect(response.body).to.have.property('payload').to.be.an('object')
      expect(response.body.payload).to.have.property('deletedCount').to.be.equal(1)
      expect(response.body.payload).to.have.property('successfulOp').to.be.equal(true)
    })
  })
})
