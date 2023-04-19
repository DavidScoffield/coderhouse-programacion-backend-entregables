import FileSystemPromises from '../utils/FileSystemPromises.js'

export default class CartManager {
  #path

  constructor(path) {
    this.#path = path
    this.fsp = new FileSystemPromises(path)
  }

  #nextId = (carts) => (carts.length === 0 ? 1 : carts[carts.length - 1].id + 1)

  #getCarts = async () => {
    if (this.fsp.exists()) {
      return await this.fsp.readFile()
    } else {
      return []
    }
  }

  getCartById = async (id) => {
    const carts = await this.#getCarts()

    const cart = carts.find((cart) => cart.id === id)

    if (!cart) {
      console.log(`Cart with id "${id}" not exist in list`)
      throw new Error(`Cart with id "${id}" not exist in list`)
    }

    return cart
  }

  addCart = async () => {
    const carts = await this.#getCarts()

    const id = this.#nextId(carts)

    const cart = {
      id,
      products: [],
    }

    const arrayWithNewCart = [...carts, cart]

    await this.fsp.writeFile(arrayWithNewCart)
    return cart
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
