/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { after, before, beforeEach, describe, it } from 'mocha'
import supertest from 'supertest'
import { app } from '../../src/app.js'
import { ADMIN_PASS, ADMIN_USER } from '../../src/constants/envVars.js'
import UserManager from '../../src/dao/mongo/managers/user.manager.js'
import { dropAllCollections } from '../helpers.js'

const requester = supertest(app)

describe('/api/sessions - Tests Session', function () {
  before(function () {
    this.userDao = new UserManager()
  })

  beforeEach(function (done) {
    dropAllCollections().then(() => {
      done()
    })
  })

  after(function (done) {
    dropAllCollections().then(() => {
      done()
    })
  })

  describe('/register - POST - Register a user', () => {
    it('should return 200 when the user data is valid', async () => {
      const response = await requester.post('/api/sessions/register').send({
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: 'test',
        age: 20,
      })
      expect(response.status).to.be.equal(200)
      expect(response.body)
        .to.have.property('message')
        .to.be.equal('Usuario registrado correctamente')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('firstName').to.be.equal('test')
      expect(response.body.payload).to.have.property('lastName').to.be.equal('test')
      expect(response.body.payload).to.have.property('email').to.be.equal('test@test.com')
      expect(response.body.payload).to.have.property('age').to.be.equal(20)
      expect(response.body.payload).to.have.property('role').to.be.equal('USER')
    })

    it('should return 200 and ignore the rol admin if it is passed and create a normal user', async () => {
      const response = await requester.post('/api/sessions/register').send({
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: 'test',
        age: 20,
        role: 'ADMIN',
      })

      expect(response.status).to.be.equal(200)
      expect(response.body)
        .to.have.property('message')
        .to.be.equal('Usuario registrado correctamente')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('firstName').to.be.equal('test')
      expect(response.body.payload).to.have.property('lastName').to.be.equal('test')
      expect(response.body.payload).to.have.property('email').to.be.equal('test@test.com')
      expect(response.body.payload).to.have.property('age').to.be.equal(20)
      expect(response.body.payload).to.have.property('role').to.be.equal('USER')
    })

    it('should return 401 when the user email is already registered', async () => {
      await requester.post('/api/sessions/register').send({
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: 'test',
        age: 20,
      })

      const response = await requester.post('/api/sessions/register').send({
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: 'test',
        age: 20,
      })

      expect(response.statusCode).to.be.equal(401)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('El email ya está registrado')
      expect(response.body).not.have.property('payload')
    })

    it('should return 401 when the user email is admin', async () => {
      const response = await requester.post('/api/sessions/register').send({
        firstName: 'test',
        lastName: 'test',
        email: ADMIN_USER,
        password: 'test',
        age: 20,
      })

      expect(response.statusCode).to.be.equal(401)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal('No se puede registrar un usuario con ese email')
    })

    it('should return 400 when the user data is invalid (age)', async () => {
      const response = await requester.post('/api/sessions/register').send({
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: 'test',
        age: 'a',
      })

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('"a" is not a valid age number')
    })

    it('should return 400 when the user data is invalid (email)', async () => {
      const response = await requester.post('/api/sessions/register').send({
        firstName: 'test',
        lastName: 'test',
        email: 'test',
        password: 'test',
        age: 20,
      })

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('"test" is not a valid email')
    })

    it('should return 400 when the user data is invalid (password)', async () => {
      const response = await requester.post('/api/sessions/register').send({
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: 1,
        age: 20,
      })

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal('"1" is not a valid password string')
    })

    it('should return 400 when the user data is invalid (firstName)', async () => {
      const response = await requester.post('/api/sessions/register').send({
        firstName: 982,
        lastName: 'test',
        email: 'test@test.com',
        password: 'test',
        age: 20,
      })

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal('"982" is not a valid firstName string')
    })

    it('should return 400 when the user data is invalid (lastName)', async () => {
      const response = await requester.post('/api/sessions/register').send({
        firstName: 'test',
        lastName: 555,
        email: 'test@test.com',
        password: 'test',
        age: 20,
      })

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal('"555" is not a valid lastName string')
    })
  })

  describe('/login - POST - Login a user', () => {
    it('should return 200 when the user logged in succesfully', async function () {
      const mockUser = {
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: 'test',
        age: 20,
      }

      await requester.post('/api/sessions/register').send(mockUser)

      const response = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const { lastConnection: userLastConnection } = await this.userDao.getUserById(
        response.body.payload.id
      )

      const cookieResponse = response.headers['set-cookie'][0]

      const cookie = {
        name: cookieResponse.split(';')[0].split('=')[0],
        value: cookieResponse.split(';')[0].split('=')[1],
      }

      expect(response.status).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body)
        .to.have.property('message')
        .to.be.equal('Usuario logueado correctamente')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('id')
      expect(response.body.payload)
        .to.have.property('name')
        .to.be.equal(`${mockUser.firstName} ${mockUser.lastName}`)
      expect(response.body.payload).to.have.property('email').to.be.equal(mockUser.email)
      expect(response.body.payload).to.have.property('role').to.be.equal('USER')
      expect(response.body.payload).to.have.property('cart').to.be.an('string')
      expect(cookieResponse).to.be.ok
      expect(cookie.name).to.be.ok.and.to.be.equal('authToken')

      expect(userLastConnection).to.be.ok.and.be.a('date')
    })

    it('should return 401 when the user email is not registered', async () => {
      const response = await requester.post('/api/sessions/login').send({
        email: 'noregister@test.com',
        password: 'test',
      })

      expect(response.status).to.be.equal(401)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal('Usuario o contraseña incorrectas')
    })

    it('should return 401 when the user password is incorrect', async () => {
      const mockUser = {
        firstName: 'test',
        lastName: 'test',
        email: 'user@test.com',
        password: 'test',
        age: 20,
      }

      await requester.post('/api/sessions/register').send(mockUser)

      const response = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: 'incorrect',
      })

      expect(response.status).to.be.equal(401)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .to.be.equal('Usuario o contraseña incorrectas')
    })
  })

  describe('/logout - GET - Logout a user', () => {
    it('should return 200 when the user logged out succesfully', async function () {
      const mockUser = {
        firstName: 'test',
        lastName: 'test',
        email: 'logout@test.com',
        password: 'test',
        age: 20,
      }

      await requester.post('/api/sessions/register').send(mockUser)

      const loginResponse = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const { lastConnection: userLastConnectionLogin } = await this.userDao.getUserById(
        loginResponse.body.payload.id
      )

      const response = await requester
        .get('/api/sessions/logout')
        .set('Cookie', loginResponse.headers['set-cookie'])

      const { lastConnection: userLastConnectionLogout } = await this.userDao.getUserById(
        loginResponse.body.payload.id
      )

      expect(response.status).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body).to.have.property('message').to.be.equal('Sesión cerrada correctamente')
      expect(userLastConnectionLogout).to.be.ok.and.to.be.greaterThan(userLastConnectionLogin)
    })

    it('should return 401 when the user try to logout without the cookie', async () => {
      const mockUser = {
        firstName: 'test',
        lastName: 'test',
        email: 'withoutCookie@test.com',
        password: 'test',
        age: 20,
      }

      await requester.post('/api/sessions/register').send(mockUser)

      await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const response = await requester.get('/api/sessions/logout')

      expect(response.status).to.be.equal(401)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('No auth token')
    })
  })

  describe('/current - GET - Get the current user', () => {
    it('should return 200 when the user is logged in', async () => {
      const mockUser = {
        firstName: 'test',
        lastName: 'test',
        email: 'current@test.com',
        password: 'test',
        age: 20,
      }

      await requester.post('/api/sessions/register').send(mockUser)

      const loginResponse = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const response = await requester
        .get('/api/sessions/current')
        .set('Cookie', loginResponse.headers['set-cookie'])

      expect(response.status).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload)
        .to.have.property('name')
        .to.be.equal(`${mockUser.firstName} ${mockUser.lastName}`)
      expect(response.body.payload).to.have.property('email').to.be.equal(mockUser.email)
      expect(response.body.payload).to.have.property('role').to.be.equal('USER')
      expect(response.body.payload).to.have.property('cart').to.be.an('string')
    })

    it('should return 200 when the user is logged in as admin', async () => {
      const mockUser = {
        email: ADMIN_USER,
        password: ADMIN_PASS,
      }

      const loginResponse = await requester.post('/api/sessions/login').send(mockUser)

      const response = await requester
        .get('/api/sessions/current')
        .set('Cookie', loginResponse.headers['set-cookie'])

      expect(response.status).to.be.equal(200)
      expect(response.body).to.have.property('status').to.be.equal('success')
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('email').to.be.equal('...')
      expect(response.body.payload).to.have.property('role').to.be.equal('ADMIN')
      expect(response.body.payload).not.have.property('cart')
      expect(response.body.payload).not.have.property('name')
    })

    it('should return 401 when the user is not logged in', async () => {
      const response = await requester.get('/api/sessions/current')

      expect(response.status).to.be.equal(401)
      expect(response.body).to.have.property('status').to.be.equal('error')
      expect(response.body).to.have.property('error').to.be.equal('No auth token')
    })
  })

  // TODO: Test restore password
})
