import { expect } from 'chai'
import { after, before, beforeEach, describe, it } from 'mocha'
import ProductManager from '../../../../src/dao/mongo/managers/product.manager.js'
import { dropAllCollections } from '../../../helpers.js'

describe('ProductManager - Testing Product Manager (DAO)', function () {
  before(function () {
    this.productDao = new ProductManager()
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

  describe('Test getting products with filters', function () {
    beforeEach(async function () {
      const product1 = {
        title: 'manzana',
        description: 'fruta manzana',
        price: 100,
        code: 'code1',
        stock: 10,
        category: 'frutas',
        status: true,
        owner: 'owner1',
      }

      const product2 = {
        title: 'banana',
        description: 'fruta banana',
        price: 200,
        code: 'code2',
        stock: 20,
        category: 'frutas',
        status: true,
        owner: 'owner2',
      }

      const product3 = {
        title: 'lechuga',
        description: 'verdura lechuga',
        price: 300,
        code: 'code3',
        stock: 30,
        category: 'lechuga',
        status: true,
        owner: 'owner3',
      }

      await this.productDao.addProduct(product1)
      await this.productDao.addProduct(product2)
      await this.productDao.addProduct(product3)
    })
    it('(getProducts) get the products with his pagination', async function () {
      const response = await this.productDao.getProducts()

      expect(response).to.have.property('docs').and.to.be.an('array')
      expect(response).to.have.property('totalDocs')
      expect(response).to.have.property('offset')
      expect(response).to.have.property('limit')
      expect(response).to.have.property('totalPages')
      expect(response).to.have.property('page')
      expect(response).to.have.property('pagingCounter')
      expect(response).to.have.property('hasPrevPage')
      expect(response).to.have.property('hasNextPage')
      expect(response).to.have.property('prevPage')
      expect(response).to.have.property('nextPage')
    })

    it('(getProducts) get the products with the filter by category', async function () {
      const response = await this.productDao.getProducts({ query: { category: 'frutas' } })

      expect(response).to.have.property('docs').and.to.be.an('array')
      expect(response).to.have.property('totalDocs').and.to.be.equal(2)
    })

    it('(getProducts) get the products with the filter limit', async function () {
      const response = await this.productDao.getProducts({ limit: 1 })

      expect(response).to.have.property('docs').and.to.be.an('array')
      expect(response).to.have.property('totalDocs').and.to.be.equal(3)
      expect(response).to.have.property('limit').and.to.be.equal(1)
    })

    it('(getProducts) get the products with the filter page', async function () {
      const response = await this.productDao.getProducts({ page: 2 })

      expect(response).to.have.property('docs').and.to.be.an('array')
      expect(response).to.have.property('totalDocs').and.to.be.equal(3)
      expect(response).to.have.property('page').and.to.be.equal(2)
    })

    it('(getProducts) get the products with the filter sort', async function () {
      const response = await this.productDao.getProducts({ sort: 'desc' })

      expect(response).to.have.property('docs').and.to.be.an('array')
      expect(response).to.have.property('totalDocs').and.to.be.equal(3)
      expect(response.docs[0]).to.have.property('price').and.to.be.equal(300)
      expect(response.docs[1]).to.have.property('price').and.to.be.equal(200)
      expect(response.docs[2]).to.have.property('price').and.to.be.equal(100)
    })
  })

  it('(getProductsById) get the product by id', async function () {
    const product = {
      title: 'manzana',
      description: 'fruta manzana',
      price: 100,
      code: 'code1',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    }

    const productCreated = await this.productDao.addProduct(product)
    const response = await this.productDao.getProductById(productCreated._id)

    expect(response).to.be.an('object')
    expect(response).to.have.property('title').and.to.be.equal(product.title)
    expect(response).to.have.property('description').and.to.be.equal(product.description)
    expect(response).to.have.property('price').and.to.be.equal(product.price)
    expect(response).to.have.property('code').and.to.be.equal(product.code)
    expect(response).to.have.property('stock').and.to.be.equal(product.stock)
    expect(response).to.have.property('category').and.to.be.equal(product.category)
    expect(response).to.have.property('status').and.to.be.equal(product.status)
    expect(response).to.have.property('owner').and.to.be.equal(product.owner)
  })

  it('(addProduct) add a product', async function () {
    const product = {
      title: 'manzana',
      description: 'fruta manzana',
      price: 100,
      code: 'code1',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    }

    const response = await this.productDao.addProduct(product)

    expect(response).to.be.an('object')
    expect(response).to.deep.include(product)
  })

  it('(updateProduct) update a product', async function () {
    const product = {
      title: 'manzana',
      description: 'fruta manzana',
      price: 100,
      code: 'code1',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    }

    const { _id } = await this.productDao.addProduct(product)

    const updatedProduct = await this.productDao.updateProduct(_id, { title: 'banana', price: 200 })

    expect(updatedProduct).to.be.an('object')
    expect(updatedProduct).to.have.property('title').and.to.be.equal('banana')
    expect(updatedProduct).to.have.property('price').and.to.be.equal(200)
  })

  it('(deleteProduct) delete a product', async function () {
    const product = {
      title: 'manzana',
      description: 'fruta manzana',
      price: 100,
      code: 'code1',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    }

    const { _id } = await this.productDao.addProduct(product)

    const productsAfterAdd = await this.productDao.getProducts()

    expect(productsAfterAdd).to.have.property('totalDocs').and.to.be.equal(1)

    const deletedProduct = await this.productDao.deleteProduct(_id)

    expect(deletedProduct).to.be.ok.and.to.be.an('object')
    expect(deletedProduct._id).to.be.ok.and.eql(_id)

    const productsAfterDelete = await this.productDao.getProducts()

    expect(productsAfterDelete).to.have.property('totalDocs').and.to.be.equal(0)
  })

  it('(getCategories) get the categories', async function () {
    const product1 = {
      title: 'lavandina',
      description: 'producto de limpieza',
      price: 100,
      code: 'code1',
      stock: 10,
      category: 'limpieza',
      status: true,
      owner: 'owner1',
    }

    const product2 = {
      title: 'banana',
      description: 'fruta banana',
      price: 200,
      code: 'code2',
      stock: 20,
      category: 'frutas',
      status: true,
      owner: 'owner2',
    }

    const product3 = {
      title: 'lechuga',
      description: 'verdura lechuga',
      price: 300,
      code: 'code3',
      stock: 30,
      category: 'verduras',
      status: true,
      owner: 'owner3',
    }

    await this.productDao.addProduct(product1)
    await this.productDao.addProduct(product2)
    await this.productDao.addProduct(product3)

    const response = await this.productDao.getCategories()

    expect(response).to.be.an('array')
    expect(response).to.have.lengthOf(3)
    expect(response).to.have.members(['frutas', 'verduras', 'limpieza'])
  })

  it('(addImages) add images to a product', async function () {
    const product = {
      title: 'lechuga',
      description: 'verdura lechuga',
      price: 300,
      code: 'code3',
      stock: 30,
      category: 'verduras',
      status: true,
      owner: 'owner3',
    }

    const createdProduct = await this.productDao.addProduct(product)

    const images = [
      {
        name: 'test.png',
        reference: '/path/test.png',
      },
      {
        name: 'test2.png',
        reference: '/path/test2.png',
      },
    ]

    const response1 = await this.productDao.addImages(createdProduct._id, [images[0]])

    expect(response1).to.be.an('object')
    expect(response1).to.have.property('_id')
    expect(response1.images).to.be.an('array')
    expect(response1.images).to.have.lengthOf(1)
    expect(response1.images[0].name).to.be.equal(images[0].name)
    expect(response1.images[0].reference).to.be.equal(images[0].reference)

    const response2 = await this.productDao.addImages(createdProduct._id, [images[1]])

    expect(response2).to.be.an('object')
    expect(response2).to.have.property('_id')
    expect(response2.images).to.be.an('array')
    expect(response2.images).to.have.lengthOf(2)
    expect(response2.images[0].name).to.be.equal(images[0].name)
    expect(response2.images[0].reference).to.be.equal(images[0].reference)
    expect(response2.images[1].name).to.be.equal(images[1].name)
    expect(response2.images[1].reference).to.be.equal(images[1].reference)
  })

  it('(removeImage) remove image from a user', async function () {
    const product = {
      title: 'lechuga',
      description: 'verdura lechuga',
      price: 300,
      code: 'code3',
      stock: 30,
      category: 'verduras',
      status: true,
      owner: 'owner3',
    }

    const createdProduct = await this.productDao.addProduct(product)

    const images = [
      {
        name: 'test.png',
        reference: '/path/test.png',
      },
      {
        name: 'test2.png',
        reference: '/path/test2.png',
      },
      {
        name: 'test3.png',
        reference: '/path/test3.png',
      },
    ]

    const withImages = await this.productDao.addImages(createdProduct._id, images)

    const imageIdToDelete = withImages.images[0]._id

    const response = await this.productDao.removeImage(withImages._id, imageIdToDelete)

    expect(response).to.be.an('object')
    expect(response).to.have.property('_id')
    expect(response.images).to.be.an('array')
    expect(response.images).to.have.lengthOf(2)
    expect(response.images[0].name).to.be.equal(images[1].name)
    expect(response.images[0].reference).to.be.equal(images[1].reference)
    expect(response.images[1].name).to.be.equal(images[2].name)
    expect(response.images[1].reference).to.be.equal(images[2].reference)
  })
})
