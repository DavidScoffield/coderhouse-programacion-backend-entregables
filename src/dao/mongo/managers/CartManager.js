import Carts from '../models/Carts.js'

export default class CartManager {
  #getCarts = async () => {
    if (this.fsp.exists()) {
      return await this.fsp.readFile()
    } else {
      return []
    }
  }

  getCartById = async (id) => {
    return Carts.findById(id)
  }

  addCart = async () => {
    return Carts.create({})
  }

  addProductToCart = async ({ cartId, productId, quantity }) => {
    const carts = await this.#getCarts()

    const cart = carts.find((cart) => cart.id === cartId)

    if (!cart) {
      console.log(`Cart with id "${cartId}" not exist in list`)
      throw new Error(`Cart with id "${cartId}" not exist in list`)
    }

    const product = cart.products.find((product) => product.id === productId)

    if (product) {
      product.quantity += quantity
    }

    if (!product) {
      cart.products.push({ id: productId, quantity })
    }

    await this.fsp.writeFile(carts)

    return cart
  }
}
