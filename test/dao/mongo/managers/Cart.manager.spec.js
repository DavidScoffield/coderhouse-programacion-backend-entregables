import { expect } from 'chai'
import { after, before, beforeEach, describe, it } from 'mocha'
import CartManager from '../../../../src/dao/mongo/managers/cart.manager.js'
import ProductManager from '../../../../src/dao/mongo/managers/product.manager.js'
import { dropAllCollections } from '../../../helpers.js'

describe('CartManager - Testing Cart Manager (DAO)', function () {
  before(async function () {
    this.cartDao = new CartManager()
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

  it('(addCart) add a cart', async function () {
    const response = await this.cartDao.addCart()

    expect(response).to.be.an('object')
    expect(response).to.have.property('_id')
    expect(response).to.have.property('products').to.be.an('array').to.have.lengthOf(0)
  })

  it('(getCartById) get a cart by id', async function () {
    const cart = await this.cartDao.addCart()
    const response = await this.cartDao.getCartById(cart._id)

    expect(response).to.be.an('object')
    expect(response).to.have.property('_id')
    expect(response._id.toString()).to.be.equal(cart._id.toString())
  })

  it('(saveCart) save a cart', async function () {
    const cart = await this.cartDao.addCart()
    const response = await this.cartDao.saveCart(cart)

    expect(response).to.be.an('object')
    expect(response).to.have.property('_id')
    expect(response._id.toString()).to.be.equal(cart._id.toString())
  })

  it('(addProductToCart) add a product to cart', async function () {
    const cart = await this.cartDao.addCart()

    const product = await this.productDao.addProduct({
      title: 'manzana',
      description: 'fruta manzana',
      price: 100,
      code: 'code1',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    })

    const response = await this.cartDao.addProductToCart({
      cart,
      productId: product._id,
      quantity: 5,
    })

    expect(response).to.be.an('object')
    expect(response).to.have.property('_id')
    expect(response._id.toString()).to.be.equal(cart._id.toString())
    expect(response).to.have.property('products').to.be.an('array').to.have.lengthOf(1)
    expect(response.products[0]).to.have.property('_id').to.be.an('object')
    expect(response.products[0]._id._id.toString()).to.be.equal(product._id.toString())
    expect(response.products[0]).to.have.property('quantity').to.be.equal(5)
  })

  it('(removeProductFromCart) remove a product from cart', async function () {
    const cart = await this.cartDao.addCart()

    const product = await this.productDao.addProduct({
      title: 'manzana',
      description: 'fruta manzana',
      price: 100,
      code: 'code1',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    })

    const cartWithProduct = await this.cartDao.addProductToCart({
      cart,
      productId: product._id,
      quantity: 5,
    })

    expect(cartWithProduct).to.be.an('object')
    expect(cartWithProduct.products).to.be.an('array').to.have.lengthOf(1)

    const cartEmpty = await this.cartDao.removeProductFromCart({
      cart: cartWithProduct,
      productId: product._id,
    })

    expect(cartEmpty).to.be.an('object')
    expect(cartEmpty).to.have.property('_id')
    expect(cartEmpty.products).to.be.an('array').to.have.lengthOf(0)
  })

  it('(removeAllProductFromCart) remove all products from cart', async function () {
    const cart = await this.cartDao.addCart()

    const product1 = await this.productDao.addProduct({
      title: 'manzana',
      description: 'fruta manzana',
      price: 100,
      code: 'code1',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    })

    const product2 = await this.productDao.addProduct({
      title: 'banana',
      description: 'fruta banana',
      price: 100,
      code: 'code2',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    })

    await this.cartDao.addProductToCart({
      cart,
      productId: product1._id,
      quantity: 5,
    })

    await this.cartDao.addProductToCart({
      cart,
      productId: product2._id,
      quantity: 10,
    })

    const cartWithProducts = await this.cartDao.getCartById(cart._id)

    expect(cartWithProducts).to.be.an('object')
    expect(cartWithProducts.products).to.be.an('array').to.have.lengthOf(2)

    const cartEmpty = await this.cartDao.removeAllProductFromCart(cart._id)

    expect(cartEmpty).to.be.an('object')
    expect(cartEmpty).to.have.property('_id')
    expect(cartEmpty.products).to.be.an('array').to.have.lengthOf(0)
  })

  it('(updateQuantityOfProductInCart) update quantity of product in cart', async function () {
    const cart = await this.cartDao.addCart()

    const product = await this.productDao.addProduct({
      title: 'manzana',
      description: 'fruta manzana',
      price: 100,
      code: 'code1',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    })

    const cartWithProduct = await this.cartDao.addProductToCart({
      cart,
      productId: product._id,
      quantity: 5,
    })

    expect(cartWithProduct)
      .to.be.an('object')
      .and.have.property('products')
      .to.be.an('array')
      .to.have.lengthOf(1)

    expect(cartWithProduct.products[0]).to.have.property('quantity').to.be.equal(5)

    const cartWithProductUpdated = await this.cartDao.updateQuantityOfProductInCart({
      cartId: cart._id,
      productId: product._id,
      quantity: 10,
    })

    expect(cartWithProductUpdated)
      .to.be.an('object')
      .and.have.property('products')
      .to.be.an('array')
      .to.have.lengthOf(1)

    expect(cartWithProductUpdated.products[0]).to.have.property('quantity').to.be.equal(10)
  })

  it('(updateCartWithProducts) update cart with products', async function () {
    const product1 = await this.productDao.addProduct({
      title: 'manzana',
      description: 'fruta manzana',
      price: 100,
      code: 'code1',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    })

    const product2 = await this.productDao.addProduct({
      title: 'banana',
      description: 'fruta banana',
      price: 100,
      code: 'code2',
      stock: 10,
      category: 'frutas',
      status: true,
      owner: 'owner1',
    })

    const cart = await this.cartDao.addCart()

    const cartWithProducts = await this.cartDao.updateCartWithProducts({
      cartId: cart._id,
      products: [
        {
          _id: product1._id,
          quantity: 5,
        },
        {
          _id: product2._id,
          quantity: 10,
        },
      ],
    })

    expect(cartWithProducts)
      .to.be.an('object')
      .and.have.property('products')
      .to.be.an('array')
      .to.have.lengthOf(2)

    expect(cartWithProducts.products[0]).to.have.property('quantity').to.be.equal(5)
    expect(cartWithProducts.products[1]).to.have.property('quantity').to.be.equal(10)

    expect(cartWithProducts.products[0]._id._id.toString()).to.be.equal(product1._id.toString())
    expect(cartWithProducts.products[1]._id._id.toString()).to.be.equal(product2._id.toString())
  })
})
