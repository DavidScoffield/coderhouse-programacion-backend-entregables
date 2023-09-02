import { expect } from 'chai'
import { after, beforeEach, describe, it } from 'mocha'
import supertest from 'supertest'
import { app } from '../../src/app.js'
import { ADMIN_PASS, ADMIN_USER } from '../../src/constants/envVars.js'
import { dropCollection } from '../helpers.js'

const requester = supertest(app)

describe('/api/carts - Tests Carts endpoint', () => {
  beforeEach((done) => {
    dropCollection('carts', 'products', 'users').then(() => {
      done()
    })
  })

  after((done) => {
    dropCollection('carts', 'products', 'users').then(() => {
      done()
    })
  })

  describe('/api/carts - POST - Create a cart', () => {
    it('Should create a cart', async () => {
      const response = await requester.post('/api/carts').send()

      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('cart')
      expect(response.body.payload.cart).to.have.property('id')
      expect(response.body.payload.cart).to.have.property('products')
      expect(response.body.payload.cart.products).to.have.lengthOf(0)
    })
  })

  describe('/api/carts/:cid - GET - Get a cart by ID', () => {
    it('Should get a cart by ID', async () => {
      const responseNewCart = await requester.post('/api/carts').send()

      const cartId = responseNewCart.body.payload.cart.id

      const response = await requester.get(`/api/carts/${cartId}`).send()

      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property('status').and.be.eq('success')
      expect(response.body).to.have.property('message').and.be.eq(`Cart with id "${cartId}" found`)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('cart')
      expect(response.body.payload.cart).to.have.property('id').and.be.equals(cartId)
      expect(response.body.payload.cart).to.have.property('products')
      expect(response.body.payload.cart.products).to.have.lengthOf(0)
    })

    it('Should not get a cart by ID if not exist', async () => {
      const cartId = '5f7d2b1c9b7d1d0d4c5a3e5c'

      const response = await requester.get(`/api/carts/${cartId}`).send()

      expect(response.status).to.be.eq(404)
      expect(response.body).to.have.property('status').and.be.eq('error')
      expect(response.body)
        .to.have.property('error')
        .and.be.eq(`Cart with id "${cartId}" not exist`)
    })

    it('Should not get a cart by ID if invalid ID', async () => {
      const cartId = 'invalid-id'

      const response = await requester.get(`/api/carts/${cartId}`).send()

      expect(response.status).to.be.eq(400)
      expect(response.body).to.have.property('status').and.be.eq('error')
      expect(response.body)
        .to.have.property('error')
        .and.be.eq(`The provided id (${cartId}) isn't valid`)
    })
  })

  describe('/api/carts/:cid/products/:pid - POST - Add a product to a cart', () => {
    const mockUser = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.com',
      password: 'test',
      age: 20,
    }

    let productId

    beforeEach(async () => {
      await requester.post('/api/sessions/register').send(mockUser)

      const mockProduct = {
        title: 'manzana',
        description: 'fruta manzana',
        price: 100,
        code: 'code1',
        stock: 10,
        category: 'frutas',
        status: true,
      }

      const loginAdminResponse = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const newProductResponse = await requester
        .post('/api/products')
        .set('Cookie', loginAdminResponse.headers['set-cookie'])
        .send(mockProduct)

      productId = newProductResponse.body.payload._id
    })

    it('Should add a product to a cart that belongs to the logged user', async () => {
      const {
        body: { payload: user },
        headers,
      } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const cartId = user.cart

      const response = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set('Cookie', headers['set-cookie'])
        .send({ quantity: 3 })

      expect(response.status).to.be.eq(200)
      expect(response.body).to.have.property('status').and.be.eq('success')
      expect(response.body)
        .to.have.property('message')
        .and.be.eq(`Product with id ${productId} was added to cart ${cartId}`)
      expect(response.body).to.have.property('payload')
      expect(response.body.payload).to.have.property('cart')
      expect(response.body.payload.cart).to.have.property('_id').and.be.equals(cartId)
      expect(response.body.payload.cart).to.have.property('products')
      expect(response.body.payload.cart.products).to.have.lengthOf(1)
      expect(response.body.payload.cart.products[0])
        .to.have.property('_id')
        .to.haveOwnProperty('_id')
        .and.be.equals(productId)
      expect(response.body.payload.cart.products[0]).to.have.property('quantity').and.be.equals(3)
    })

    it('Should not add a product to a cart that not belongs to the logged user', async () => {
      const mockUser2 = {
        firstName: 'test2',
        lastName: 'test2',
        email: 'test2@test.com',
        password: 'test2',
        age: 20,
      }
      await requester.post('/api/sessions/register').send(mockUser2)

      const {
        body: { payload: user },
      } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const cartId = user.cart

      const loginUser2Response = await requester.post('/api/sessions/login').send({
        email: mockUser2.email,
        password: mockUser2.password,
      })

      const response = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set('Cookie', loginUser2Response.headers['set-cookie'])
        .send({ quantity: 3 })

      expect(response.status).to.be.eq(401)
      expect(response.body).to.have.property('status').and.be.eq('error')
      expect(response.body)
        .to.have.property('error')
        .and.be.eq(`You are not authorized to perform this action`)
    })

    it('Should not add a product that not exist to a cart', async () => {
      const {
        body: { payload: user },
        headers,
      } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const cartId = user.cart
      const productId = '5f7d2b1c9b7d1d0d4c5a3e5c'

      const response = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set('Cookie', headers['set-cookie'])
        .send({ quantity: 3 })

      expect(response.status).to.be.eq(400)
      expect(response.body).to.have.property('status').and.be.eq('error')
      expect(response.body)
        .to.have.property('error')
        .and.be.eq(`Product with id "${productId}" not exist`)
    })

    it('Should not add a product to a cart if invalid product ID ', async () => {
      const {
        body: { payload: user },
        headers,
      } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const cartId = user.cart
      const productId = 'invalid-id'

      const response = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set('Cookie', headers['set-cookie'])
        .send({ quantity: 3 })

      expect(response.status).to.be.eq(400)
      expect(response.body).to.have.property('status').and.be.eq('error')
      expect(response.body)
        .to.have.property('error')
        .and.be.eq(`The provided id (${productId}) isn't valid`)
    })

    it('A PREMIUM user should not add a product that belongs it to his cart ', async () => {
      // Login like admin
      const { headers: adminHeaders } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      // Register a PREMIUM user
      const mockPremiumUser = {
        firstName: 'test2',
        lastName: 'test2',
        email: 'premium@test.com',
        password: 'test2',
        age: 20,
        role: 'PREMIUM',
      }

      await requester
        .post('/api/sessions/registerUsers')
        .set('Cookie', adminHeaders['set-cookie'])
        .send(mockPremiumUser)

      // Login like PREMIUM user
      const {
        body: { payload: user },
        headers: premiumHeaders,
      } = await requester.post('/api/sessions/login').send({
        email: mockPremiumUser.email,
        password: mockPremiumUser.password,
      })

      const cartId = user.cart

      // Create a product like PREMIUM user
      const mockProduct = {
        title: 'manzana',
        description: 'fruta manzana',
        price: 100,
        code: 'code10',
        stock: 10,
        category: 'frutas',
        status: true,
      }

      const responseNewProduct = await requester
        .post('/api/products')
        .set('Cookie', premiumHeaders['set-cookie'])
        .send(mockProduct)

      const productId = responseNewProduct.body.payload._id

      // Add his own product to his cart
      const response = await requester
        .post(`/api/carts/${cartId}/products/${productId}`)
        .set('Cookie', premiumHeaders['set-cookie'])
        .send({ quantity: 3 })

      console.log(response.body)

      expect(response.status).to.be.eq(401)
      expect(response.body).to.have.property('status').and.be.eq('error')
      expect(response.body)
        .to.have.property('error')
        .and.be.eq(`You are not authorized to perform this action. "${productId}" is your product`)
    })
  })
})
