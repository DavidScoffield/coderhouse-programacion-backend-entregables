/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import fs from 'fs'
import { after, beforeEach, describe, it } from 'mocha'
import supertest from 'supertest'
import { app } from '../../src/app.js'
import { MULTER_PATH_FOLDER } from '../../src/constants/constants.js'
import { ADMIN_PASS, ADMIN_USER, MULTER_DEST } from '../../src/constants/envVars.js'
import { productRepository } from '../../src/services/repositories/index.js'
import { createImagesInMemory, deleteRandomFiles, dropAllCollections } from '../helpers.js'

const requester = supertest(app)

describe('/api/products - Tests Products', () => {
  beforeEach(function (done) {
    dropAllCollections().then(async () => {
      await deleteRandomFiles(MULTER_PATH_FOLDER)
      done()
    })
  })

  after(function (done) {
    dropAllCollections().then(async () => {
      await deleteRandomFiles()
      done()
    })
  })

  describe('/ - GET - Get all products', () => {
    it('should return 200 and an empty array', async () => {
      const response = await requester.get('/api/products')

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').and.be.equal('success')
      expect(response.body).to.have.property('message').and.be.equal('Products found')
      expect(response.body).to.have.property('payload').and.be.an('object')
      expect(response.body.payload).to.have.property('products').and.be.an('array').and.be.empty
      expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
      expect(response.body.payload).to.have.property('page').and.be.equal(1)
    })

    it('should return 200 and an array with 1 product', async () => {
      const mockProduct = {
        title: 'title',
        description: 'description',
        price: 123,
        thumbnail: ['thumbnail'],
        code: 'code',
        stock: 1,
        category: 'category',
        status: true,
        owner: 'owner',
      }

      await productRepository.addProduct(mockProduct)

      const response = await requester.get('/api/products')

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').and.be.equal('success')
      expect(response.body).to.have.property('message').and.be.equal('Products found')

      expect(response.body).to.have.property('payload').and.be.an('object')
      expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
      expect(response.body.payload).to.have.property('page').and.be.equal(1)

      expect(response.body.payload)
        .to.have.property('products')
        .and.be.an('array')
        .and.have.lengthOf(1)

      expect(response.body.payload.products[0])
        .to.have.property('title')
        .and.be.equal(mockProduct.title)
      expect(response.body.payload.products[0])
        .to.have.property('description')
        .and.be.equal(mockProduct.description)
      expect(response.body.payload.products[0])
        .to.have.property('price')
        .and.be.equal(mockProduct.price)
      expect(response.body.payload.products[0])
        .to.have.property('thumbnail')
        .and.be.an('array')
        .and.have.lengthOf(1)
      expect(response.body.payload.products[0])
        .to.have.property('code')
        .and.be.equal(mockProduct.code)
      expect(response.body.payload.products[0])
        .to.have.property('stock')
        .and.be.equal(mockProduct.stock)
      expect(response.body.payload.products[0])
        .to.have.property('category')
        .and.be.equal(mockProduct.category)
      expect(response.body.payload.products[0])
        .to.have.property('status')
        .and.be.equal(mockProduct.status)
      expect(response.body.payload.products[0])
        .to.have.property('owner')
        .and.be.equal(mockProduct.owner)
      expect(response.body.payload.products[0]).to.have.property('_id').and.be.a('string')
    })

    describe('Test Pagination - 3 total products ', () => {
      beforeEach(async () => {
        await productRepository.addProduct({
          title: 'title1',
          description: 'description1',
          price: 123,
          thumbnail: ['thumbnail1'],
          code: 'code1',
          stock: 1,
          category: 'category1',
          status: true,
          owner: 'owner1',
        })

        await productRepository.addProduct({
          title: 'title2',
          description: 'description2',
          price: 123,
          thumbnail: ['thumbnail2'],
          code: 'code2',
          stock: 1,
          category: 'category2',
          status: true,
          owner: 'owner2',
        })

        await productRepository.addProduct({
          title: 'title3',
          description: 'description3',
          price: 123,
          thumbnail: ['thumbnail3'],
          code: 'code3',
          stock: 1,
          category: 'category3',
          status: true,
          owner: 'owner3',
        })
      })

      it('should return 200 and an array with 1 product (limit=1, page=2)', async () => {
        const limit = 1
        const page = 2

        const response = await requester.get(`/api/products?limit=${limit}&page=${page}`)

        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(3)
        expect(response.body.payload).to.have.property('page').and.be.equal(page)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.true
        expect(response.body.payload)
          .to.have.property('nextPage')
          .and.be.equal(page + 1)

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(1)
      })

      it('should return 200 and an array with 2 products (limit=2, page=1)', async () => {
        const limit = 2
        const page = 1

        const response = await requester.get(`/api/products?limit=${limit}&page=${page}`)

        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(2)
        expect(response.body.payload).to.have.property('page').and.be.equal(page)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.true
        expect(response.body.payload)
          .to.have.property('nextPage')
          .and.be.equal(page + 1)

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(2)
      })

      it('should return 200 and an array with 3 products (limit=3, page=1)', async () => {
        const limit = 3
        const page = 1

        const response = await requester.get(`/api/products?limit=${limit}&page=${page}`)

        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
        expect(response.body.payload).to.have.property('page').and.be.equal(page)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.false
        expect(response.body.payload).to.have.property('nextPage').and.be.null

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(3)
      })

      it('should return 400 - Invalid limit', async () => {
        const limit = 'invalid-limit'

        const response = await requester.get(`/api/products?limit=${limit}`)

        expect(response.statusCode).to.be.equal(400)
        expect(response.body).to.have.property('status').and.be.equal('error')
        expect(response.body)
          .to.have.property('error')
          .and.be.equal('"invalid-limit" is not a valid limit number')
      })

      it('should return 400 - Invalid page', async () => {
        const page = 'invalid-page'

        const response = await requester.get(`/api/products?page=${page}`)

        expect(response.statusCode).to.be.equal(400)
        expect(response.body).to.have.property('status').and.be.equal('error')
        expect(response.body)
          .to.have.property('error')
          .and.be.equal('"invalid-page" is not a valid page number')
      })
    })

    describe('Test Sorting - 3 total products ', () => {
      const mockProducts = [
        {
          title: 'title1',
          description: 'description1',
          price: 10,
          thumbnail: ['thumbnail1'],
          code: 'code1',
          stock: 1,
          category: 'category1',
          status: true,
          owner: 'owner1',
        },
        {
          title: 'title2',
          description: 'description2',
          price: 20,
          thumbnail: ['thumbnail2'],
          code: 'code2',
          stock: 1,
          category: 'category2',
          status: true,
          owner: 'owner2',
        },
        {
          title: 'title3',
          description: 'description3',
          price: 30,
          thumbnail: ['thumbnail3'],
          code: 'code3',
          stock: 1,
          category: 'category3',
          status: true,
          owner: 'owner3',
        },
      ]
      beforeEach(async () => {
        await productRepository.addProduct(mockProducts[0])

        await productRepository.addProduct(mockProducts[1])

        await productRepository.addProduct(mockProducts[2])
      })

      it('should return 200 and an array with 3 products sorting the price ascendent (sort=asc)', async () => {
        const sort = 'asc'

        const response = await requester.get(`/api/products?sort=${sort}`)

        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
        expect(response.body.payload).to.have.property('page').and.be.equal(1)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.false
        expect(response.body.payload).to.have.property('nextPage').and.be.null

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(3)

        expect(response.body.payload.products[0])
          .to.have.property('price')
          .and.be.equal(mockProducts[0].price)
        expect(response.body.payload.products[1])
          .to.have.property('price')
          .and.be.equal(mockProducts[1].price)
        expect(response.body.payload.products[2])
          .to.have.property('price')
          .and.be.equal(mockProducts[2].price)
      })

      it('should return 200 and an array with 3 products sorting the price descendent (sort=desc)', async () => {
        const sort = 'desc'

        const response = await requester.get(`/api/products?sort=${sort}`)

        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
        expect(response.body.payload).to.have.property('page').and.be.equal(1)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.false
        expect(response.body.payload).to.have.property('nextPage').and.be.null

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(3)

        expect(response.body.payload.products[0])
          .to.have.property('price')
          .and.be.equal(mockProducts[2].price)
        expect(response.body.payload.products[1])
          .to.have.property('price')
          .and.be.equal(mockProducts[1].price)
        expect(response.body.payload.products[2])
          .to.have.property('price')
          .and.be.equal(mockProducts[0].price)
      })
    })

    describe('Test Filtering by Category - 3 total products ', () => {
      const mockProducts = [
        {
          title: 'title1',
          description: 'description1',
          price: 10,
          thumbnail: ['thumbnail1'],
          code: 'code1',
          stock: 1,
          category: 'category1',
          status: true,
          owner: 'owner1',
        },
        {
          title: 'title2',
          description: 'description2',
          price: 20,
          thumbnail: ['thumbnail2'],
          code: 'code2',
          stock: 1,
          category: 'category2',
          status: true,
          owner: 'owner2',
        },
        {
          title: 'title3',
          description: 'description3',
          price: 30,
          thumbnail: ['thumbnail3'],
          code: 'code3',
          stock: 1,
          category: 'category2',
          status: true,
          owner: 'owner3',
        },
      ]

      beforeEach(async () => {
        await productRepository.addProduct(mockProducts[0])
        await productRepository.addProduct(mockProducts[1])
        await productRepository.addProduct(mockProducts[2])
      })

      it('should return 200 and an array with 1 product (category=category1)', async () => {
        const category = 'category1'

        const response = await requester.get(`/api/products?category=${category}`)

        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
        expect(response.body.payload).to.have.property('page').and.be.equal(1)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.false
        expect(response.body.payload).to.have.property('nextPage').and.be.null

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(1)

        expect(response.body.payload.products[0])
          .to.have.property('category')
          .and.be.equal(category)
      })

      it('should return 200 and an array with 2 products (category=category2)', async () => {
        const category2 = 'category2'

        const response = await requester.get(`/api/products?category=${category2}`)
        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
        expect(response.body.payload).to.have.property('page').and.be.equal(1)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.false
        expect(response.body.payload).to.have.property('nextPage').and.be.null

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(2)

        expect(response.body.payload.products[0])
          .to.have.property('category')
          .and.be.equal(category2)
        expect(response.body.payload.products[1])
          .to.have.property('category')
          .and.be.equal(category2)
      })

      it('should return 200 and an array with 0 products (category=category3)', async () => {
        const category3 = 'category3'

        const response = await requester.get(`/api/products?category=${category3}`)

        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
        expect(response.body.payload).to.have.property('page').and.be.equal(1)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.false
        expect(response.body.payload).to.have.property('nextPage').and.be.null

        expect(response.body.payload).to.have.property('products').and.be.an('array').and.be.empty
      })
    })

    describe('Test Filtering by Status - 3 total products ', () => {
      const mockProducts = [
        {
          title: 'title1',
          description: 'description1',
          price: 10,
          thumbnail: ['thumbnail1'],
          code: 'code1',
          stock: 1,
          category: 'category1',
          status: true,
          owner: 'owner1',
        },
        {
          title: 'title2',
          description: 'description2',
          price: 20,
          thumbnail: ['thumbnail2'],
          code: 'code2',
          stock: 1,
          category: 'category2',
          status: true,
          owner: 'owner2',
        },
        {
          title: 'title3',
          description: 'description3',
          price: 30,
          thumbnail: ['thumbnail3'],
          code: 'code3',
          stock: 1,
          category: 'category2',
          status: false,
          owner: 'owner3',
        },
      ]

      beforeEach(async () => {
        await productRepository.addProduct(mockProducts[0])
        await productRepository.addProduct(mockProducts[1])
        await productRepository.addProduct(mockProducts[2])
      })

      it('should return 200 and an array with 2 products (status=true)', async () => {
        const status = true

        const response = await requester.get(`/api/products?status=${status}`)

        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
        expect(response.body.payload).to.have.property('page').and.be.equal(1)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.false
        expect(response.body.payload).to.have.property('nextPage').and.be.null

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(2)

        expect(response.body.payload.products[0]).to.have.property('status').and.be.equal(status)
        expect(response.body.payload.products[1]).to.have.property('status').and.be.equal(status)
      })

      it('should return 200 and an array with 1 product (status=false)', async () => {
        const status = false

        const response = await requester.get(`/api/products?status=${status}`)
        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
        expect(response.body.payload).to.have.property('page').and.be.equal(1)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.false
        expect(response.body.payload).to.have.property('nextPage').and.be.null

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(1)

        expect(response.body.payload.products[0]).to.have.property('status').and.be.equal(status)
      })
    })

    describe('Test Pagination with Sorting and Filtering - 5 total products', async () => {
      const mockProducts = [
        {
          title: 'title1',
          description: 'description1',
          price: 10,
          thumbnail: ['thumbnail1'],
          code: 'code1',
          stock: 1,
          category: 'category1',
          status: true,
          owner: 'owner1',
        },
        {
          title: 'title2',
          description: 'description2',
          price: 20,
          thumbnail: ['thumbnail2'],
          code: 'code2',
          stock: 1,
          category: 'category2',
          status: true,
          owner: 'owner2',
        },
        {
          title: 'title3',
          description: 'description3',
          price: 30,
          thumbnail: ['thumbnail3'],
          code: 'code3',
          stock: 1,
          category: 'category2',
          status: true,
          owner: 'owner3',
        },
        {
          title: 'title4',
          description: 'description4',
          price: 40,
          thumbnail: ['thumbnail4'],
          code: 'code4',
          stock: 1,
          category: 'category3',
          status: true,
          owner: 'owner4',
        },
        {
          title: 'title5',
          description: 'description5',
          price: 50,
          thumbnail: ['thumbnail5'],
          code: 'code5',
          stock: 1,
          category: 'category3',
          status: false,
          owner: 'owner5',
        },
      ]

      beforeEach(async () => {
        await productRepository.addProduct(mockProducts[0])
        await productRepository.addProduct(mockProducts[1])
        await productRepository.addProduct(mockProducts[2])
        await productRepository.addProduct(mockProducts[3])
        await productRepository.addProduct(mockProducts[4])
      })

      it('should return 200 and an array with 1 product (limit=1, page=2, sort=asc, category=category2, status=true)', async () => {
        const limit = 1
        const page = 2
        const sort = 'asc'
        const category = 'category2'
        const status = true

        const response = await requester.get(
          `/api/products?limit=${limit}&page=${page}&sort=${sort}&category=${category}&status=${status}`
        )

        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(2)
        expect(response.body.payload).to.have.property('page').and.be.equal(page)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.false
        expect(response.body.payload).to.have.property('nextPage').and.be.null

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(1)

        expect(response.body.payload.products[0])
          .to.have.property('price')
          .and.be.equal(mockProducts[2].price)
      })

      it('should return 200 and an array with 2 products (limit=2, page=1, sort=desc, category=category3, status=false)', async () => {
        const limit = 2
        const page = 1
        const sort = 'desc'
        const category = 'category3'
        const status = false

        const response = await requester.get(
          `/api/products?limit=${limit}&page=${page}&sort=${sort}&category=${category}&status=${status}`
        )

        expect(response.statusCode).to.be.equal(200)
        expect(response.body).to.have.property('status').and.be.equal('success')
        expect(response.body).to.have.property('message').and.be.equal('Products found')

        expect(response.body).to.have.property('payload').and.be.an('object')
        expect(response.body.payload).to.have.property('totalPages').and.be.equal(1)
        expect(response.body.payload).to.have.property('page').and.be.equal(page)
        expect(response.body.payload).to.have.property('hasNextPage').to.be.false
        expect(response.body.payload).to.have.property('nextPage').and.be.null

        expect(response.body.payload)
          .to.have.property('products')
          .and.be.an('array')
          .and.have.lengthOf(1)

        expect(response.body.payload.products[0])
          .to.have.property('price')
          .and.be.equal(mockProducts[4].price)
      })
    })
  })

  describe('/:pid - GET - Get product by id', () => {
    it('should return 200 and the product', async () => {
      const mockProduct = {
        title: 'title',
        description: 'description',
        price: 123,
        thumbnail: ['thumbnail'],
        code: 'code',
        stock: 1,
        category: 'category',
        status: true,
        owner: 'owner',
      }

      const product = await productRepository.addProduct(mockProduct)

      const response = await requester.get(`/api/products/${product._id}`)

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').and.be.equal('success')
      expect(response.body).to.have.property('message').and.be.equal('Product found')

      expect(response.body).to.have.property('payload').and.be.an('object')

      expect(response.body.payload).to.have.property('title').and.be.equal(mockProduct.title)
      expect(response.body.payload)
        .to.have.property('description')
        .and.be.equal(mockProduct.description)
      expect(response.body.payload).to.have.property('price').and.be.equal(mockProduct.price)
      expect(response.body.payload)
        .to.have.property('thumbnail')
        .and.be.an('array')
        .and.have.lengthOf(1)
      expect(response.body.payload).to.have.property('code').and.be.equal(mockProduct.code)
      expect(response.body.payload).to.have.property('stock').and.be.equal(mockProduct.stock)
      expect(response.body.payload).to.have.property('category').and.be.equal(mockProduct.category)
      expect(response.body.payload).to.have.property('status').and.be.equal(mockProduct.status)
      expect(response.body.payload).to.have.property('owner').and.be.equal(mockProduct.owner)
      expect(response.body.payload).to.have.property('_id').and.be.a('string')
    })

    it('should return 404 - Product not found', async () => {
      const id = 'invalid-id'

      const response = await requester.get(`/api/products/${id}`)

      expect(response.statusCode).to.be.equal(400)
      expect(response.body).to.have.property('status').and.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .and.be.equal(`The provided id (${id}) isn't valid`)
    })
  })

  describe('/ - POST - Create a product', () => {
    const mockUser = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@prueba.com',
      password: 'test',
      age: 20,
    }

    beforeEach(async function () {
      await requester.post('/api/sessions/register').send(mockUser)
    })

    it('should return 401 if no token is provided', async () => {
      const mockProduct = {
        title: 'title',
        description: 'description',
        price: 123,
        thumbnail: ['thumbnail'],
        code: 'code',
        stock: 1,
        category: 'category',
        status: true,
        owner: 'owner',
      }

      const response = await requester.post('/api/products').send(mockProduct)

      expect(response.statusCode).to.be.equal(401)
      expect(response.body).to.have.property('status').and.be.equal('error')
      expect(response.body).to.have.property('error').and.be.equal('No auth token')
    })

    it('should return 403 if is not an admin o premium user', async () => {
      const mockProduct = {
        title: 'title',
        description: 'description',
        price: 123,
        thumbnail: ['thumbnail'],
        code: 'code',
        stock: 1,
        category: 'category',
        status: true,
        owner: 'owner',
      }

      const { headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const response = await requester
        .post('/api/products')
        .send(mockProduct)
        .set('Cookie', headers['set-cookie'])

      expect(response.statusCode).to.be.equal(403)
      expect(response.body).to.have.property('status').and.be.equal('error')
      expect(response.body).to.have.property('error').and.be.equal('Forbidden')
    })

    it('should return 200 and the created product with no files', async () => {
      const mockProduct = {
        title: 'title',
        description: 'description',
        price: 123,
        thumbnail: ['thumbnail'],
        code: 'code',
        stock: 1,
        category: 'category',
        status: true,
      }

      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const response = await requester
        .post('/api/products')
        .send(mockProduct)
        .set('Cookie', headers['set-cookie'])

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').and.be.equal('success')
      expect(response.body)
        .to.have.property('message')
        .and.be.equal(`New product with id "${response.body.payload._id}" was added`)

      expect(response.body).to.have.property('payload').and.be.an('object')

      expect(response.body.payload).to.have.property('title').and.be.equal(mockProduct.title)
      expect(response.body.payload)
        .to.have.property('description')
        .and.be.equal(mockProduct.description)
      expect(response.body.payload).to.have.property('price').and.be.equal(mockProduct.price)
      expect(response.body.payload)
        .to.have.property('thumbnail')
        .and.be.an('array')
        .and.have.lengthOf(1)
      expect(response.body.payload).to.have.property('code').and.be.equal(mockProduct.code)
      expect(response.body.payload).to.have.property('stock').and.be.equal(mockProduct.stock)
      expect(response.body.payload).to.have.property('category').and.be.equal(mockProduct.category)
      expect(response.body.payload).to.have.property('status').and.be.equal(mockProduct.status)
      expect(response.body.payload).to.have.property('owner').and.be.equal('Admin')
      expect(response.body.payload).to.have.property('_id').and.be.a('string')
    })

    it('should return 200 and the created product with 2 files sended', async () => {
      const createdImages = createImagesInMemory({
        numberOfImages: 2,
        maxSizeInMB: 10,
      })

      const mockProduct = {
        title: 'title',
        description: 'description',
        price: 123,
        thumbnail: ['thumbnail'],
        code: 'code',
        stock: 1,
        category: 'category',
        status: true,
      }

      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const request = requester
        .post('/api/products')
        .set('Cookie', headers['set-cookie'])
        .attach('products', createdImages[0].content, createdImages[0].name)
        .attach('products', createdImages[1].content, createdImages[1].name)

      // attack the mockProduct to the request
      for (const key in mockProduct) {
        request.field(key, mockProduct[key])
      }

      // Send de request
      const response = await request

      const files = fs.readdirSync(`${MULTER_DEST}/products`)

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').and.be.equal('success')
      expect(response.body)
        .to.have.property('message')
        .and.be.equal(`New product with id "${response.body.payload._id}" was added`)

      expect(response.body).to.have.property('payload').and.be.an('object')

      expect(response.body.payload).to.have.property('title').and.be.equal(mockProduct.title)
      expect(response.body.payload)
        .to.have.property('description')
        .and.be.equal(mockProduct.description)
      expect(response.body.payload).to.have.property('price').and.be.equal(mockProduct.price)
      expect(response.body.payload)
        .to.have.property('thumbnail')
        .and.be.an('array')
        .and.have.lengthOf(1)
      expect(response.body.payload).to.have.property('code').and.be.equal(mockProduct.code)
      expect(response.body.payload).to.have.property('stock').and.be.equal(mockProduct.stock)
      expect(response.body.payload).to.have.property('category').and.be.equal(mockProduct.category)
      expect(response.body.payload).to.have.property('status').and.be.equal(mockProduct.status)
      expect(response.body.payload).to.have.property('owner').and.be.equal('Admin')
      expect(response.body.payload).to.have.property('_id').and.be.a('string')

      // Check if the files were saved
      expect(files).to.have.lengthOf(2)
      expect(files[0]).to.be.match(new RegExp(createdImages[0].name))
      expect(files[1]).to.be.match(new RegExp(createdImages[1].name))
    })
  })

  describe('/:pid/images - POST - Add images to a product', function () {
    const mockUser = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.com',
      password: 'test',
      age: 20,
    }
    const mockProduct = {
      title: 'title',
      description: 'description',
      price: 123,
      thumbnail: ['thumbnail'],
      code: 'code',
      stock: 1,
      category: 'category',
      status: true,
    }

    beforeEach(async function () {
      await requester.post('/api/sessions/register').send(mockUser)

      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const { body } = await requester
        .post('/api/products')
        .send(mockProduct)
        .set('Cookie', headers['set-cookie'])

      this.productId = body.payload._id
    })

    it('should return 401 if no token is provided', async function () {
      const response = await requester.post(`/api/products/${this.productId}/images`).send()

      expect(response.statusCode).to.be.equal(401)
      expect(response.body).to.have.property('status').and.be.equal('error')
      expect(response.body).to.have.property('error').and.be.equal('No auth token')
    })

    it('should return 403 if is not an admin o premium user', async () => {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const response = await requester
        .post(`/api/products/${this.productId}/images`)
        .set('Cookie', headers['set-cookie'])
        .send()

      expect(response.statusCode).to.be.equal(403)
      expect(response.body).to.have.property('status').and.be.equal('error')
      expect(response.body).to.have.property('error').and.be.equal('Forbidden')
    })

    it('should return 200 and the product with 2 images', async function () {
      const createdImages = createImagesInMemory({
        numberOfImages: 2,
        maxSizeInMB: 10,
      })

      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const response = await requester
        .post(`/api/products/${this.productId}/images`)
        .set('Cookie', headers['set-cookie'])
        .attach('products', createdImages[0].content, createdImages[0].name)
        .attach('products', createdImages[1].content, createdImages[1].name)

      const files = fs.readdirSync(`${MULTER_DEST}/products`)

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').and.be.equal('success')
      expect(response.body)
        .to.have.property('message')
        .and.be.equal(`Images was added to product "${this.productId}"`)

      expect(response.body).to.have.property('payload').and.be.an('object')

      expect(response.body.payload).to.have.property('title').and.be.equal(mockProduct.title)
      expect(response.body.payload)
        .to.have.property('description')
        .and.be.equal(mockProduct.description)
      expect(response.body.payload).to.have.property('price').and.be.equal(mockProduct.price)
      expect(response.body.payload)
        .to.have.property('thumbnail')
        .and.be.an('array')
        .and.have.lengthOf(1)
      expect(response.body.payload).to.have.property('code').and.be.equal(mockProduct.code)
      expect(response.body.payload).to.have.property('stock').and.be.equal(mockProduct.stock)
      expect(response.body.payload).to.have.property('category').and.be.equal(mockProduct.category)
      expect(response.body.payload).to.have.property('status').and.be.equal(mockProduct.status)
      expect(response.body.payload).to.have.property('owner').and.be.equal('Admin')
      expect(response.body.payload).to.have.property('_id').and.be.a('string')
      expect(response.body.payload)
        .to.have.property('images')
        .and.be.an('array')
        .and.have.lengthOf(2)
      expect(response.body.payload.images[0]).to.have.property('_id').and.be.a('string')
      expect(response.body.payload.images[0])
        .to.have.property('name')
        .and.be.a('string')
        .and.be.match(new RegExp(createdImages[0].name))
      expect(response.body.payload.images[0]).to.have.property('reference').and.be.a('string')

      expect(response.body.payload.images[1]).to.have.property('_id').and.be.a('string')
      expect(response.body.payload.images[1])
        .to.have.property('name')
        .and.be.a('string')
        .and.be.match(new RegExp(createdImages[1].name))
      expect(response.body.payload.images[1]).to.have.property('reference').and.be.a('string')

      // Check if the files were saved
      expect(files).to.have.lengthOf(2)
      expect(files[0]).to.be.match(new RegExp(createdImages[0].name))
      expect(files[1]).to.be.match(new RegExp(createdImages[1].name))
    })
  })

  describe('/:pid/images/:iid - DELETE - Delete an image from a product', function () {
    const mockUser = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.com',
      password: 'test',
      age: 20,
    }
    const mockProduct = {
      title: 'title',
      description: 'description',
      price: 123,
      thumbnail: ['thumbnail'],
      code: 'code',
      stock: 1,
      category: 'category',
      status: true,
    }

    beforeEach(async function () {
      await requester.post('/api/sessions/register').send(mockUser)

      const createdImages = createImagesInMemory({
        numberOfImages: 2,
        maxSizeInMB: 10,
      })

      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const request = requester
        .post('/api/products')
        .set('Cookie', headers['set-cookie'])
        .attach('products', createdImages[0].content, createdImages[0].name)
        .attach('products', createdImages[1].content, createdImages[1].name)

      // attack the mockProduct to the request
      for (const key in mockProduct) {
        request.field(key, mockProduct[key])
      }

      // Send de request
      const response = await request

      this.product = response.body.payload
    })

    it('should return 401 if no token is provided', async function () {
      const imageId = this.product.images[0]._id

      const response = await requester.delete(`/api/products/${this.product._id}/images/${imageId}`)

      expect(response.statusCode).to.be.equal(401)
      expect(response.body).to.have.property('status').and.be.equal('error')
      expect(response.body).to.have.property('error').and.be.equal('No auth token')
    })

    it('should return 403 if is not an admin o premium user', async function () {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const imageId = this.product.images[0]._id

      const response = await requester
        .delete(`/api/products/${this.product._id}/images/${imageId}`)
        .set('Cookie', headers['set-cookie'])

      expect(response.statusCode).to.be.equal(403)
      expect(response.body).to.have.property('status').and.be.equal('error')
      expect(response.body).to.have.property('error').and.be.equal('Forbidden')
    })

    it('should return 200 and the product with 1 image when remove 1 of 2 images of product', async function () {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const imageId = this.product.images[0]._id

      const filesBeforeDelete = fs.readdirSync(`${MULTER_DEST}/products`)

      expect(filesBeforeDelete).to.have.lengthOf(2)

      const response = await requester
        .delete(`/api/products/${this.product._id}/images/${imageId}`)
        .set('Cookie', headers['set-cookie'])

      const filesAfterDelete = fs.readdirSync(`${MULTER_DEST}/products`)
      const updatedProduct = response.body.payload

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').and.be.equal('success')
      expect(response.body)
        .to.have.property('message')
        .and.be.equal(`Image with id "${imageId}" was removed from product "${this.product._id}"`)
      expect(updatedProduct).to.have.property('images').and.be.an('array').and.have.lengthOf(1)
      expect(updatedProduct.images[0]).to.have.property('_id').and.be.a('string')
      expect(updatedProduct.images[0])
        .to.have.property('name')
        .and.be.a('string')
        .and.be.match(new RegExp(this.product.images[1].name))
      expect(updatedProduct.images[0]).to.have.property('reference').and.be.a('string')

      // Check if the file was removed of the folder
      expect(filesAfterDelete).to.have.lengthOf(1)
      expect(filesAfterDelete[0]).to.be.match(new RegExp(this.product.images[1].name))
    })
  })

  describe('/:pid - DELETE - Delete a product', function () {
    const mockUser = {
      firstName: 'premium',
      lastName: 'premium',
      email: 'premium@test.com',
      password: 'premium',
      role: 'PREMIUM',
      age: 20,
    }
    const mockProduct = {
      title: 'title',
      description: 'description',
      price: 123,
      thumbnail: ['thumbnail'],
      code: 'code',
      stock: 1,
      category: 'category',
      status: true,
    }

    beforeEach(async function () {
      const { headers: adminHeaders } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      await requester
        .post('/api/sessions/registerUsers')
        .send(mockUser)
        .set('Cookie', adminHeaders['set-cookie'])

      const { body } = await requester
        .post('/api/products')
        .send(mockProduct)
        .set('Cookie', adminHeaders['set-cookie'])

      this.productId = body.payload._id
    })

    it('should return 401 if no token is provided', async function () {
      const response = await requester.delete(`/api/products/${this.productId}`)

      expect(response.statusCode).to.be.equal(401)
      expect(response.body).to.have.property('status').and.be.equal('error')
      expect(response.body).to.have.property('error').and.be.equal('No auth token')
    })

    it('should return 403 if is not an admin o premium user', async function () {
      const mockRegularUser = {
        firstName: 'john',
        lastName: 'basic',
        email: 'john@test.com',
        password: 'joshaps',
        age: 20,
      }

      await requester.post('/api/sessions/register').send(mockRegularUser)

      const { headers } = await requester.post('/api/sessions/login').send({
        email: mockRegularUser.email,
        password: mockRegularUser.password,
      })

      const response = await requester
        .delete(`/api/products/${this.productId}`)
        .set('Cookie', headers['set-cookie'])

      expect(response.statusCode).to.be.equal(403)
      expect(response.body).to.have.property('status').and.be.equal('error')
      expect(response.body).to.have.property('error').and.be.equal('Forbidden')
    })

    it('should return 401 if a premium user try to delete a product that is not yours', async function () {
      const { headers: headersPremium } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const response = await requester
        .delete(`/api/products/${this.productId}`)
        .set('Cookie', headersPremium['set-cookie'])

      expect(response.statusCode).to.be.equal(401)
      expect(response.body).to.have.property('status').and.be.equal('error')
      expect(response.body)
        .to.have.property('error')
        .and.be.equal(`You are not authorized to perform this action`)
    })

    it('should return 200 and the product deleted - by admin', async function () {
      const { headers } = await requester.post('/api/sessions/login').send({
        email: ADMIN_USER,
        password: ADMIN_PASS,
      })

      const response = await requester
        .delete(`/api/products/${this.productId}`)
        .set('Cookie', headers['set-cookie'])

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').and.be.equal('success')
      expect(response.body)
        .to.have.property('message')
        .and.be.equal(`Product "${this.productId}" was successfully deleted`)

      const responseGet = await requester.get(`/api/products/${this.productId}`)
      expect(responseGet.statusCode).to.be.equal(404)
      expect(responseGet.body).to.have.property('status').and.be.equal('error')
      expect(responseGet.body)
        .to.have.property('error')
        .and.be.equal(`Product with id "${this.productId}" not found`)

      const responseGetAll = await requester.get(`/api/products`)
      expect(responseGetAll.statusCode).to.be.equal(200)
      expect(responseGetAll.body).to.have.property('status').and.be.equal('success')
      expect(responseGetAll.body).to.have.property('message').and.be.equal('Products found')
      expect(responseGetAll.body).to.have.property('payload').and.be.an('object')
      expect(responseGetAll.body.payload).to.have.property('totalPages').and.be.equal(1)
      expect(responseGetAll.body.payload).to.have.property('page').and.be.equal(1)
      expect(responseGetAll.body.payload).to.have.property('hasNextPage').to.be.false
      expect(responseGetAll.body.payload).to.have.property('nextPage').and.be.null
      expect(responseGetAll.body.payload)
        .to.have.property('products')
        .and.be.an('array')
        .and.have.lengthOf(0)
    })

    it('should return 200 and the product deleted - by premium user', async function () {
      const mockProductOfPremium = {
        title: 'title',
        description: 'description',
        price: 123,
        thumbnail: ['thumbnail'],
        code: 'code99',
        stock: 1,
        category: 'category',
        status: true,
      }

      const { headers: headersPremium } = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      })

      const {
        body: { payload: newProduct },
      } = await requester
        .post('/api/products')
        .send(mockProductOfPremium)
        .set('Cookie', headersPremium['set-cookie'])

      const response = await requester
        .delete(`/api/products/${newProduct._id}`)
        .set('Cookie', headersPremium['set-cookie'])

      expect(response.statusCode).to.be.equal(200)
      expect(response.body).to.have.property('status').and.be.equal('success')
      expect(response.body)
        .to.have.property('message')
        .and.be.equal(`Product "${newProduct._id}" was successfully deleted`)

      const responseGet = await requester.get(`/api/products/${newProduct._id}`)
      expect(responseGet.statusCode).to.be.equal(404)
      expect(responseGet.body).to.have.property('status').and.be.equal('error')
      expect(responseGet.body)
        .to.have.property('error')
        .and.be.equal(`Product with id "${newProduct._id}" not found`)
    })
  })
})
